<?php

namespace Tests\Feature;

use App\Models\Episode;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeenEpisodeTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_user_can_mark_an_episode_as_seen()
    {
        $this->signIn();

        // Given we have an episode
        $episode = create(Episode::class);

        // If a POST request is sent to /episode/id/seens
        $this->post("/episodes/{$episode->id}/seen-episodes");

        // The seen status should be saved
        $this->assertTrue($episode->isSeen());
    }
}

