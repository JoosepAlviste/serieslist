<?php

namespace App\Http\Controllers;

use App\Models\Season;

class SeasonsController extends Controller
{
    /**
     * Show one season page.
     *
     * @param int $seriesId
     * @param int $seasonNumber
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show($seriesId, $seasonNumber)
    {
        $season = Season::where('series_id', $seriesId)
                        ->where('number', $seasonNumber)
                        ->first();

        return view('seasons.show', [
            'season' => $season,
        ]);
    }
}