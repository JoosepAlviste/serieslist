<?php

namespace App\Http\Controllers;

use App\Http\Repositories\SeasonsRepository;
use App\Models\Season;

class SeasonsController extends Controller
{
    /** @var SeasonsRepository */
    private $seasonsRepository;

    /**
     * SeasonsController constructor.
     * @param SeasonsRepository $seasonsRepository
     */
    public function __construct(SeasonsRepository $seasonsRepository)
    {
        $this->seasonsRepository = $seasonsRepository;
    }

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
        $season = $this->seasonsRepository->fetch($seriesId, $seasonNumber);
        $nextSeason = $season->nextSeason;

        $isSeen = $season->episodes
            ->every(function ($episode) {
                return $episode->seenEpisodes->count() !== 0;
            });

        return view('seasons.show', [
            'season'     => $season,
            'nextSeason' => $nextSeason,
            'isSeen'     => $isSeen,
        ]);
    }
}
