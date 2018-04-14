<?php

namespace App\Http\Controllers\Api;

use App\Models\Series;
use App\Models\User;
use App\Http\Resources\InProgressSeries as InProgressSeriesResource;
use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;

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
     * Also included are the latest seen episodes and the net episode that
     * should be watched.
     *
     * @param User $user
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(User $user)
    {
        $status = request()->get('status', null);

        /** @var Series[]|Collection $series */
        $series = Series::byStatus($status, $user->id)
            ->withProgress($user->id)
            ->get();

        // TODO: Refactor this to be a bit prettier
        $seenEpisodes = $series->map(function (Series $series) {
            $seenEpisode = [
                'series_id' => $series->id,
                'series_title' => $series->title,
            ];

            if (!$series->progresses->isEmpty()) {
                // We have some episodes in the series_progresses table
                $progress = $series->progresses[0];

                $seenEpisode['episode_id'] = $progress->latest_seen_episode_id;
                $seenEpisode['shortSlug'] = $progress->latestSeenEpisode
                    ->shortSlug();
                $seenEpisode['next_episode_id'] = $progress->next_episode_id;
            }

            return (object) $seenEpisode;
        });

        return InProgressSeriesResource::collection($seenEpisodes);
    }
}
