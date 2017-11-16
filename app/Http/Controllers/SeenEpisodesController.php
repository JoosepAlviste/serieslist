<?php

namespace App\Http\Controllers;

use App\Http\Resources\InProgressSeries;
use App\Models\Episode;
use App\Models\Season;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

class SeenEpisodesController extends Controller
{
    /**
     * Toggle an episode's seen status for the authenticated user.
     *
     * @param Episode $episode
     *
     * @return InProgressSeries|Episode|RedirectResponse|Redirector
     */
    public function toggle(Episode $episode)
    {
        $episode->toggleSeen(auth()->id());

        if (request()->expectsJson()) {
            $seenEpisode = new \StdClass;
            $seenEpisode->series_id = $episode->season->series_id;
            $seenEpisode->series_title = $episode->season->series->title;
            $seenEpisode->episode_id = $episode->id;
            $seenEpisode->shortSlug = $episode->shortSlug();

            $nextEpisode = $episode->nextEpisode();
            if ($nextEpisode) {
                $seenEpisode->next_episode_id = $nextEpisode->id;
            } else {
                $seenEpisode->next_episode_id = null;
            }

            return new InProgressSeries($seenEpisode);
        }

        return redirect($episode->path());
    }

    /**
     * Mark all episodes in the season as seen.
     *
     * @param Season $season
     *
     * @return RedirectResponse|Redirector
     */
    public function markSeasonAsSeen(Season $season)
    {
        foreach ($season->episodes as $episode) {
            $episode->markAsSeen();
        }

        return redirect($season->path());
    }
}
