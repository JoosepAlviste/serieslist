<?php

namespace App\Http\Controllers\Api;

use App\Models\Season;
use App\Models\SeenEpisode;
use App\Models\Series;
use App\Models\User;
use App\Http\Resources\InProgressSeries as InProgressSeriesResource;
use App\Http\Controllers\Controller;
use App\Queries\LatestSeenEpisodesQuery;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class SeriesListController.
 *
 * @package App\Http\Controllers\Api
 */
class SeriesListController extends Controller
{
    /**
     * Get the list of series for the current user based on the given status
     * filter. If no status is given for the filter, get all series to which
     * the user has marked a status.
     *
     * @param User $user
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(User $user)
    {
        $status = request()->get('status', null);

        /** @var Collection|Series[] $series */
        $series = Series::byStatus($status, $user->id)->get();

        if ($series->isEmpty()) {
            return InProgressSeriesResource::collection(new Collection);
        }

        $params = collect([$user->id]);
        $series->each(function ($series) use ($params) {
            $params->push($series->id);
        });

        $seenEpisodes = (new LatestSeenEpisodesQuery($params->toArray()))
            ->execute();

        // TODO: Refactor this!

        if ($seenEpisodes->count() !== $series->count()) {
            $series->each(function ($serie) use ($seenEpisodes) {
                $contains = $seenEpisodes->contains(function ($seenEp) use ($serie) {
                    return $seenEp->series_id === $serie->id;
                });

                if (!$contains) {
                    $newSeenEpisode = new \StdClass;
                    $newSeenEpisode->series_id = $serie->id;
                    $newSeenEpisode->series_title = $serie->title;
                    $newSeenEpisode->season_id = null;
                    $newSeenEpisode->episode_id = null;
                    $newSeenEpisode->season_number = null;
                    $newSeenEpisode->episode_number = null;
                    $newSeenEpisode->next_episode_id = null;

                    $seenEpisodes->push($newSeenEpisode);
                }
            });
        }

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
                    $thisEpisode->next_episode_id = $nextEpisode->id;
                    return true;
                }

                return false;
            });

            $filtered = $matches->filter(function ($match) {
                return $match === true;
            });
            return $filtered->isEmpty();
        });

        $nextSeasons = new Collection;
        if (! $episodesWithNoEpisodeSameSeason->isEmpty()) {
            $nextSeasonsQuery = Season::with('episodes');
            $episodesWithNoEpisodeSameSeason->each(function ($episode) use ($nextSeasonsQuery) {
                $nextSeasonsQuery->orWhere(function ($query) use ($episode) {
                    $query->where('number', $episode->season_number + 1)
                        ->where('series_id', $episode->series_id);
                });
            });
            $nextSeasons = $nextSeasonsQuery->get();
        }

        $seenEpisodes->each(function ($seenEpisode) use ($nextSeasons) {
            $nextSeasons->each(function ($nextSeason) use ($seenEpisode) {
                if ($seenEpisode->series_id === $nextSeason->series_id) {
                    $seenEpisode->next_episode_id = $nextSeason->episodes->first()->id;
                }
            });
        });

        return InProgressSeriesResource::collection($seenEpisodes);
    }
}
