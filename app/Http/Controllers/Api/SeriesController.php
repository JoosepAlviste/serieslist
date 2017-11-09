<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Episode;
use App\Models\Season;
use App\Models\Series;
use App\Models\User;
use App\Queries\LatestSeenEpisodesQuery;
use Illuminate\Support\Collection;

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

        $lastSeenEpisodes = Episode::find(
            $seenEpisodes->map(function ($seenEpisode) {
                return $seenEpisode->episode_id;
            })
        );
        $seenSeries       = Collection::make([]);
        $lastSeenEpisodes = $this->findNextEpisodes($lastSeenEpisodes);

        $lastSeenEpisodes->each(function (Episode $episode) use ($seenSeries) {
            $series = $episode->season->series->toArray();

            $episodeArr = $episode->makeHidden('season')->toArray();

            $nextEpisode = $episode->calculatedNextEpisode;
            if ($nextEpisode) {
                $episodeArr['nextEpisode'] = $nextEpisode->makeHidden('season')->toArray();
            } else {
                $episodeArr['nextEpisode'] = null;
            }
            $episodeArr['shortSlug'] = $episode->shortSlug();

            $series['latestSeenEpisode'] = $episodeArr;
            $seenSeries->push($series);
        });

        $seenSeries = $seenSeries->sortBy('title');

        return $seenSeries->values()->all();
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
