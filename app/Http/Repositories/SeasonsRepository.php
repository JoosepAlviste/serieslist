<?php

namespace App\Http\Repositories;

use App\Models\Season;

/**
 * Class SeasonsRepository.
 * Wraps eloquent queries for the Season model.
 *
 * @package App\Http\Repositories
 */
class SeasonsRepository
{
    /**
     * Fetch a season based on the series id and the season
     * number. Also eager load some fields.
     *
     * @param int $seriesId
     * @param int $seasonNumber
     *
     * @return Season
     */
    public function fetch($seriesId, $seasonNumber)
    {
        $season = Season::where('series_id', $seriesId)
            ->where('number', $seasonNumber)
            ->with([
                'series',
                'episodes',
                'episodes.seenEpisodes' => function ($query) {
                    $query->where('user_id', auth()->id());
                }
            ])
            ->first();

        return $season;
    }
}