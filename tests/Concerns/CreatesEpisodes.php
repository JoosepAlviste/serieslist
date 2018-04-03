<?php


namespace Tests\Concerns;


use App\Models\Episode;
use App\Models\Season;
use App\Models\Series;
use Illuminate\Support\Collection;

trait CreatesEpisodes
{
    /**
     * Create back to back episodes for a series. The episodes are in the same
     * season and the next episode's numbers will be one more than the previous
     * one's.
     *
     * It just returns a collection of episodes where they are in numerical
     * order.
     *
     * @param Series $series
     * @param int $numberOfEpisodes
     *
     * @return Collection|Episode[]
     */
    protected function createSubsequentEpisodes($series, $numberOfEpisodes = 2)
    {
        $firstEpisode = create(Episode::class, [
            'season_id' => create(Season::class, [
                'series_id' => $series->id,
            ]),
        ]);
        $episodes = Collection::make([$firstEpisode]);

        for ($i = 1; $i < $numberOfEpisodes; $i++) {
            $nextEpisode = create(Episode::class, [
                'season_id' => $firstEpisode->season_id,
                'number' => $episodes->last()->number + 1
            ]);

            $episodes->push($nextEpisode);
        }

        return $episodes;
    }
}