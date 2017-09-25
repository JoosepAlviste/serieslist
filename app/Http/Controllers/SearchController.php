<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use App\Models\Series;
use Illuminate\Support\Collection;

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
                        ->limit(6)
                        ->get();

        $episodes = Episode::search($q)
                           ->orderBy('title')
                           ->limit(6)
                           ->get();

        return view('search.index', [
            'series'   => $series,
            'episodes' => $episodes,
            'q'        => request()->input('q'),
        ]);
    }

    public function series()
    {
        $q = strtolower(request()->input('q'));

        $series = Series::search($q)
                        ->orderBy('title')
                        ->paginate(10);
        $series->appends(request()->input())->links();

        return view('search.series', [
            'series' => $series,
            'q'        => request()->input('q'),
        ]);
    }

    public function episodes()
    {
        $q = strtolower(request()->input('q'));

        $episodes = Episode::search($q)
                           ->orderBy('title')
                           ->paginate(10);
        $episodes->appends(request()->input())->links();

        return view('search.episodes', [
            'episodes' => $episodes,
            'q'        => request()->input('q'),
        ]);
    }
}
