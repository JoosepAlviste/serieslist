<?php

namespace App\Repositories;

use App\Models\Episode;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EpisodesRepository
{
    /**
     * Search for episodes with the given keyword.
     *
     * @param string $q
     * @param int|null $limit
     *
     * @return Collection|Episode[]
     */
    public function search($q, $limit = null)
    {
        $limit = $limit ?: config('app.search-limit');

        $episodes = Episode::search($q)
            ->orderBy('title')
            ->limit($limit)
            ->get();

        return $episodes;
    }

    /**
     * Search for episodes with the given keyword and paginate the
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

        $episodes = Episode::search($q)
            ->orderBy('title')
            ->paginate($perPage);

        return $episodes;
    }
}
