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
        $q = request()->input('q');

        $series = Series::where('title', 'LIKE', "%{$q}%")
            ->orWhere('description', 'LIKE', "%{$q}%")
            ->get();
        $episodes = Episode::where('title', 'LIKE', "%{$q}%")
                        ->get();

        return view('search.index', compact('series', 'episodes', 'q'));
    }
}
