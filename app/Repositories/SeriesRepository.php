<?php

namespace App\Repositories;

use App\Models\Series;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class SeriesRepository.
 * Used to encapsulate the eloquent queries.
 *
 * @package App\Http\Repositories
 */
class SeriesRepository
{
    /**
     * Search for series with the given keyword.
     *
     * @param string $q
     * @param int|null $limit
     *
     * @return Collection|Series[]
     */
    public function search($q, $limit = null)
    {
        $limit = $limit ?: config('app.search-limit');

        $series = Series::search($q)
            ->limit($limit)
            ->get();

        return $series;
    }

    /**
     * Search for series with the given keyword and paginate the
     * results.
     *
     * @param string $q
     * @param int|null $perPage
     *
     * @return LengthAwarePaginator
     */
    public function searchPaginate($q, $perPage = null)
    {
        $perPage = $perPage ?: 10;  // TODO: Move to conf?

        $series = Series::search($q)
            ->orderBy('title')
            ->paginate($perPage);

        return $series;
    }

    /**
     * Paginate all series.
     *
     * @param int|null $perPage
     *
     * @return LengthAwarePaginator
     */
    public function paginate($perPage = null)
    {
        $perPage = $perPage ?: 10;  // TODO: Move to conf?

        $series = Series::orderBy('title')
            ->paginate($perPage);

        return $series;
    }
}
