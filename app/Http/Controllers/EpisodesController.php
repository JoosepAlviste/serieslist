<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use Illuminate\Http\Request;

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
        return view('episodes.show', compact('episode'));
    }
}
