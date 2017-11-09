<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Episode;
use App\Models\Season;
use App\Models\Series;
use App\Models\User;
use App\Queries\LatestSeenEpisodesQuery;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class SeriesController.
 *
 * @package App\Http\Controllers\Api
 */
class SeriesController extends Controller
{
    /**
     * Get the in progress series for the currently authenticated
     * user.
     *
     * @param User $user
     *
     * @return Series[]|Collection
     */
    public function inProgressSeries(User $user)
    {
        $seenEpisodes = (new LatestSeenEpisodesQuery([$user->id]))
            ->execute();
        // series_id, series_title, episode_id, season_id, season_number,
        // episode_number

        // Need:
        // series_id  -  have
        // season_number  -  have
        // episode_id, episode_number  -  have
        // next_episode_id

        // Next episodes
        $query = DB::table('episodes')->select(['id', 'season_id']);
        foreach ($seenEpisodes as $episode) {
            $episode->shortSlug = sprintf("S%02dE%02d", $episode->season_number, $episode->episode_number);
            $query->orWhere(function ($query) use ($episode) {
                $query->where('number', $episode->episode_number + 1)
                      ->where('season_id', $episode->season_id);
            });
        }
        $nextEpisodesInSameSeason = $query->get();

        $episodesWithNoEpisodeSameSeason = $seenEpisodes->filter(function ($thisEpisode) use ($nextEpisodesInSameSeason) {
            $matches = $nextEpisodesInSameSeason->map(function ($nextEpisode) use ($thisEpisode) {
                if ($nextEpisode->season_id === $thisEpisode->season_id) {
                    $thisEpisode->nextEpisode = $nextEpisode;
                    return true;
                }

                return false;
            });

            $filtered = $matches->filter(function ($match) {
                return $match === true;
            });
            return $filtered->isEmpty();
        });

        // next seasons  - 1 query
        $nextSeasonsQuery = Season::with('episodes');
        $episodesWithNoEpisodeSameSeason->each(function ($episode) use ($nextSeasonsQuery) {
            $nextSeasonsQuery->orWhere(function ($query) use ($episode) {
                $query->where('number', $episode->season_number + 1)
                      ->where('series_id', $episode->series_id);
            });
        });
        $nextSeasons = $nextSeasonsQuery->get();

        $seenEpisodes->each(function ($seenEpisode) use ($nextSeasons) {
            $nextSeasons->each(function ($nextSeason) use ($seenEpisode) {
                if ($seenEpisode->series_id === $nextSeason->series_id) {
                    $seenEpisode->nextEpisode = $nextSeason->episodes->first()->toArray();
                }
            });
        });
        $seenEpisodes->sortBy('series_title');

        return $seenEpisodes;
    }

    /**
     * @param Episode[]|Collection $episodes
     *
     * @return Collection|Episode[]
     */
    private function findNextEpisodes($episodes)
    {
        // TODO: Refactor this pls
        $query = Episode::query();
        $episodes->each(function (Episode $episode) use ($query) {
            $query->orWhere(function ($query) use ($episode) {
                $query->where('number', $episode->number + 1)
                    ->where('season_id', $episode->season_id);
            });
        });
        $nextEpisodesInSameSeason = $query->get();

        $episodesWithNoEpisodeSameSeason = $episodes->filter(function (Episode $thisEpisode) use ($nextEpisodesInSameSeason) {
            $matches = $nextEpisodesInSameSeason->map(function (Episode $nextEpisode) use ($thisEpisode) {
                if ($nextEpisode->season_id === $thisEpisode->season_id) {
                    $thisEpisode->calculatedNextEpisode = $nextEpisode;
                    return true;
                }

                return false;
            });

            $filtered = $matches->filter(function ($match) {
                return $match === true;
            });
            return $filtered->isEmpty();
        });

        $nextSeasonsQuery = Season::with('episodes');
        $episodes->each(function (Episode $episode) use ($nextSeasonsQuery) {
            $nextSeasonsQuery->orWhere(function ($query) use ($episode) {
                $query->where('number', $episode->season->number + 1)
                    ->where('series_id', $episode->season->series_id);
            });
        });
        $nextSeasons = $nextSeasonsQuery->get();

        $episodes->each(function (Episode $episode) use ($nextSeasons) {
            $nextSeasons->each(function (Season $nextSeason) use ($episode) {
                if ($episode->season->series_id === $nextSeason->series_id) {
                    $episode->season->calculatedNextSeason = $nextSeason;
                }
            });
        });

        $episodesWithNoEpisodeSameSeason->each(function (Episode $episode) {
            $nextSeason = $episode->season->calculatedNextSeason;

            if ($nextSeason) {
                $episode->calculatedNextEpisode = $nextSeason->episodes->first();
            }
        });

        return $episodes;
    }
}
