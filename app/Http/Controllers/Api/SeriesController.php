<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Episode;
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

        $lastSeenEpisodes->each(function ($episode) use ($seenSeries) {
            $series = $episode->season->series->toArray();

            $episodeArr = $episode->makeHidden('season')->toArray();

            $nextEpisode = $episode->nextEpisode();
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
}
