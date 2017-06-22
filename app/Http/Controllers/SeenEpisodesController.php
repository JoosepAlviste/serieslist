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
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function toggle(Episode $episode)
    {
        $episode->toggleSeen(auth()->id());

        return redirect($episode->path());
    }
}
