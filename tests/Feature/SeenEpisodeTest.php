<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\SeenEpisode;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeenEpisodeTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_user_can_mark_an_episode_as_seen()
    {
        $this->signIn();
        $episode = create(Episode::class);

        $this->assertFalse($episode->isSeen);

        $this->markEpisodeSeen($episode);

        $this->assertTrue($episode->fresh()->isSeen);
    }

    /** @test */
    function the_seen_status_of_episodes_is_toggled()
    {
        $episode = $this->markEpisodeSeen();

        $this->assertTrue($episode->isSeen);

        $episode = $this->markEpisodeSeen($episode);

        $this->assertFalse($episode->fresh()->isSeen);

        $episode = $this->markEpisodeSeen($episode);

        $this->assertTrue($episode->fresh()->isSeen);
    }

    protected function markEpisodeSeen($episode = null)
    {
        if (!auth()->check()) {
            $this->signIn();
        }

        $episode = $episode ?: create(Episode::class);
        $this->post("/episodes/{$episode->id}/seen-episodes");

        return $episode;
    }
}

