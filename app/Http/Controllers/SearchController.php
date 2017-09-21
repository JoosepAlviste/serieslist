<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use App\Models\Series;
use Illuminate\Support\Facades\DB;

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
        $q = strtolower('%' . request()->input('q') . '%');

        $series = Series::whereRaw('LOWER(title) like ?', [$q])
            ->orWhereRaw('LOWER(description) like ?', [$q])
            ->limit(10)
            ->get();

        $episodes = Episode::whereRaw('LOWER(title) like ?', [$q])
                        ->limit(10)
                        ->get();

        return view('search.index', [
            'series' => $series,
            'episodes' => $episodes,
            'q' => request()->input('q'),
        ]);
    }
}
