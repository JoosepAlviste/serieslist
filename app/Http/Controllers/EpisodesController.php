<?php

namespace App\Http\Controllers;

use App\Models\Episode;

class EpisodesController extends Controller
{
    /**
     * Show one episode view.
     *
     * @param int $seriesId
     * @param Episode $episode
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show($seriesId, Episode $episode)
    {
        $nextEpisode = $episode->nextEpisode();

        return view('episodes.show', compact('episode', 'nextEpisode'));
    }
}
