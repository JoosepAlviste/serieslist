<?php

namespace Tests\Feature;

use App\Models\Episode;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeenTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_user_can_mark_an_episode_as_seen()
    {
//        $this->signIn();
//
//        // Given we have an episode
//        $episode = create(Episode::class);
//
//        // If a POST request is sent to /seen-episodes
//        $this->post("/episodes/{$episode->id}/seen");
//
//        // The seen status should be saved
//        $this->assertDatabaseHas('seens', [
//            'episode_id' => $episode->id,
//            'user_id' => auth()->id(),
//        ]);
    }
}

