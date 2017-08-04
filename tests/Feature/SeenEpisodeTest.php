<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Season;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

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

    /** @test */
    function a_guest_cannot_mark_an_episode_as_seen()
    {
        $this->withExceptionHandling();

        $episode = create(Episode::class);

        $this->post("/episodes/{$episode->id}/seen-episodes")
            ->assertRedirect('/login');

        $this->assertFalse($episode->fresh()->isSeen);
    }

    /** @test */
    function an_authenticated_user_can_mark_a_whole_season_as_seen()
    {
        $this->signIn();

        $season   = create(Season::class);
        $episodes = create(Episode::class, [
            'season_id' => $season,
        ], 5);

        $this->post("/seasons/{$season->id}/seen-episodes");

        $episodes->each(function ($episode) {
            $this->assertTrue($episode->fresh()->isSeen);
        });
    }

    /** @test */
    function a_guest_cannot_mark_a_season_as_seen()
    {
        $this->withExceptionHandling();

        $season   = create(Season::class);
        $episodes = create(Episode::class, [
            'season_id' => $season,
        ], 5);

        $this->post("/seasons/{$season->id}/seen-episodes")
             ->assertStatus(302)
             ->assertRedirect('/login');

        $episodes->each(function ($episode) {
            $this->assertFalse($episode->fresh()->isSeen);
        });
    }

    protected function markEpisodeSeen($episode = null)
    {
        if ( ! auth()->check()) {
            $this->signIn();
        }

        $episode = $episode ?: create(Episode::class);
        $this->post("/episodes/{$episode->id}/seen-episodes");

        return $episode;
    }
}

