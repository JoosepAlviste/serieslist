<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use App\Models\Series;

/**
 * Class SearchController.
 *
 * @package App\Http\Controllers
 */
class SearchController extends Controller
{
    /**
     * Show the Search page with results.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $q = strtolower(request()->input('q'));

        $series = Series::search($q)
                        ->limit(10)
                        ->get();

        $episodes = Episode::search($q)
                           ->orderBy('title')
                           ->limit(10)
                           ->get();

        return view('search.index', [
            'series'   => $series,
            'episodes' => $episodes,
            'q'        => request()->input('q'),
        ]);
    }
}
