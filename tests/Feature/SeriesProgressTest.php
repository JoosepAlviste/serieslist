<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Series;
use App\Models\SeriesProgress;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Concerns\CreatesEpisodes;
use Tests\TestCase;

class SeriesProgressTest extends TestCase
{
    use DatabaseMigrations, CreatesEpisodes;

    /** @test */
    public function marking_an_episode_as_not_seen_correctly_updates_the_progress()
    {
        $this->signIn();

        $series = create(Series::class);
        $episodes = $this->createSubsequentEpisodes($series, 3);
        create(SeriesProgress::class, [
            'user_id' => auth()->id(),
            'series_id' => $series->id,
            'latest_seen_episode_id' => $episodes[1]->id,
            'next_episode_id' => $episodes[2]->id,
        ]);

        $this->json('post', "/episodes/{$episodes[1]->id}/seen-episodes");

        $this->assertDatabaseHas('series_progresses', [
            'user_id' => auth()->id(),
            'series_id' => $series->id,
            'latest_seen_episode_id' => $episodes[0]->id,
            'next_episode_id' => $episodes[1]->id,
        ]);
    }

    /** @test */
    function marking_an_episode_as_not_seen_deletes_progress_if_first_episode()
    {
        $this->signIn();

        /** @var Episode $episode */
        $episode = create(Episode::class);
        create(SeriesProgress::class, [
            'user_id' => auth()->id(),
            'series_id' => $episode->season->series_id,
            'latest_seen_episode_id' => $episode->id,
        ]);

        $this->json('post', "/episodes/{$episode->id}/seen-episodes");

        $this->assertDatabaseMissing('series_progresses', [
            'user_id' => auth()->id(),
            'series_id' => $episode->season->series_id,
        ]);
    }
}
