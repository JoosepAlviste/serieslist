<?php

namespace App\Http\Controllers;

use App\Repositories\EpisodesRepository;
use App\Repositories\SeriesRepository;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\View\View;

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
    /** @var EpisodesRepository */
    private $episodesRepository;

    /**
     * SearchController constructor.
     *
     * @param Request $request
     * @param SeriesRepository $seriesRepository
     * @param EpisodesRepository $episodesRepository
     */
    public function __construct(
        Request $request,
        SeriesRepository $seriesRepository,
        EpisodesRepository $episodesRepository
    )
    {
        $this->request = $request;
        $this->seriesRepository = $seriesRepository;
        $this->episodesRepository = $episodesRepository;
    }

    /**
     * Show the Search page with results.
     *
     * @return View
     */
    public function index()
    {
        $q = $this->getQuery();

        $series = $this->seriesRepository->search($q);
        $episodes = $this->episodesRepository->search($q);

        return view('search.index', [
            'series'   => $series,
            'episodes' => $episodes,
            'q'        => $this->request->input('q'),
        ]);
    }

    /**
     * Show the page for showing series search results.
     *
     * @return Factory|View
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
     * @return Factory|View
     */
    public function episodes()
    {
        $q = $this->getQuery();

        $episodes = $this->episodesRepository->searchPaginate($q);
        $episodes->appends($this->request->input())->links();

        return view('search.episodes', [
            'episodes' => $episodes,
            'q'        => $this->request->input('q'),
        ]);
    }

    /**
     * Get the search query keyword for this request.
     *
     * @return string
     */
    protected function getQuery()
    {
        return strtolower($this->request->input('q'));
    }
}
