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
        $q = $this->getQuery();

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

    /**
     * Show the page for showing series search results.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function series()
    {
        $q = $this->getQuery();

        $series = Series::search($q)
                        ->orderBy('title')
                        ->paginate(10);
        $series->appends(request()->input())->links();

        return view('search.series', [
            'series' => $series,
            'q'        => request()->input('q'),
        ]);
    }

    /**
     * Show the page for showing episodes search results.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function episodes()
    {
        $q = $this->getQuery();

        $episodes = Episode::search($q)
                           ->orderBy('title')
                           ->paginate(10);
        $episodes->appends(request()->input())->links();

        return view('search.episodes', [
            'episodes' => $episodes,
            'q'        => request()->input('q'),
        ]);
    }

    /**
     * Get the search query keyword.
     *
     * @return string
     */
    protected function getQuery()
    {
        return strtolower(request()->input('q'));
    }
}
