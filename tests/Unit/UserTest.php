<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\SeenEpisode;
use App\Models\Series;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class UserTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function it_knows_its_in_progress_series()
    {
        $user = create(User::class);
        $seenEpisode = create(SeenEpisode::class, [
            'user_id' => $user->id,
        ]);
        $seenEpisodeTwo = create(SeenEpisode::class, [
            'user_id' => $user->id,
        ]);
        $notSeenEpisode = create(Episode::class);

        $series = $user->inProgressSeries();

        $this->assertInstanceOf(Series::class, $series->first(function ($singleSeries) use ($seenEpisode) {
            return $singleSeries->id === $seenEpisode->id;
        }));
        $this->assertInstanceOf(Series::class, $series->first(function ($singleSeries) use ($seenEpisodeTwo) {
            return $singleSeries->id === $seenEpisodeTwo->id;
        }));

        $this->assertNull($series->first(function ($singleSeries) use ($notSeenEpisode) {
            return $singleSeries->id === $notSeenEpisode->id;
        }));
    }
}

