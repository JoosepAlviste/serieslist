<?php

namespace App\Http\Controllers;

use App\Http\Repositories\SeriesRepository;
use App\Models\Episode;
use App\Models\Series;
use Illuminate\Http\Request;

/**
 * Class SearchController.
 *
 * @package App\Http\Controllers
 */
class SearchController extends Controller
{
    /** @var Request */
    private $request;
    /** @var SeriesRepository */
    private $seriesRepository;

    /**
     * SearchController constructor.
     *
     * @param Request $request
     * @param SeriesRepository $seriesRepository
     */
    public function __construct(Request $request, SeriesRepository $seriesRepository)
    {
        $this->request = $request;
        $this->seriesRepository = $seriesRepository;
    }

    /**
     * Show the Search page with results.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $q = $this->getQuery();

        $series = $this->seriesRepository->search($q);

        $episodes = Episode::search($q)
            ->orderBy('title')
            ->limit(6)
            ->get();

        return view('search.index', [
            'series'   => $series,
            'episodes' => $episodes,
            'q'        => $this->request->input('q'),
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

        $series = $this->seriesRepository->searchPaginate($q);
        $series->appends($this->request->input())->links();

        return view('search.series', [
            'series' => $series,
            'q'      => $this->request->input('q'),
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
        $episodes->appends($this->request->input())->links();

        return view('search.episodes', [
            'episodes' => $episodes,
            'q'        => $this->request->input('q'),
        ]);
    }

    /**
     * Get the search query keyword.
     *
     * @return string
     */
    protected function getQuery()
    {
        return strtolower($this->request->input('q'));
    }
}
