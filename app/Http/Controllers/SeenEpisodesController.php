<?php

namespace App\Http\Controllers;

use App\Models\Episode;

class SeenEpisodesController extends Controller
{
    /**
     * Toggle an episode's seen status for the authenticated user.
     *
     * @param Episode $episode
     *
     * @return Episode|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function toggle(Episode $episode)
    {
        $episode->toggleSeen(auth()->id());

        if (request()->expectsJson()) {
            $nextEpisode = $episode->nextEpisode();
            if ($nextEpisode) {
                $nextEpisode->shortSlug = $nextEpisode->shortSlug();
            }

            $episode->nextEpisode = $nextEpisode;
            $episode->shortSlug = $episode->shortSlug();

            return $episode;
        }

        return redirect($episode->path());
    }
}
