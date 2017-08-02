<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\SeenEpisode;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class ListTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_users_in_progress_list_can_be_accessed()
    {
        $this->signIn();
        $seenEpisode = create(SeenEpisode::class, [
            'user_id' => auth()->id(),
        ]);
        $seenEpisodeTwo = create(SeenEpisode::class, [
            'user_id' => auth()->id(),
        ]);
        $notSeenEpisode = create(Episode::class);

        $response = $this->get('/users/' . auth()->id() . '/series');

        $response->assertSee($seenEpisode->episode->season->series->title);
        $response->assertSee($seenEpisodeTwo->episode->season->series->title);

        $response->assertDontSee($notSeenEpisode->season->series->title);
    }
}

