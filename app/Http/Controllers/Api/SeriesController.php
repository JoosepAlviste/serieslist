<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Episode;
use App\Models\Series;
use App\Models\User;
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
        return $user
            ->inProgressSeries()
            ->each(function ($series) {
                /** @var Series $series */
                $latestEpisode = $series->latestSeenEpisode();
                if ($latestEpisode) {
                    $latestEpisode->shortSlug = $latestEpisode->shortSlug();
                    $latestEpisode->nextEpisode = $latestEpisode->nextEpisode();
                }
                $series->latestSeenEpisode = $latestEpisode;
            });
    }
}
