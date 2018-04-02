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

    /** @test */
    function when_a_season_is_marked_as_seen_the_series_progress_will_be_updated()
    {
        $this->signIn();

        $season   = create(Season::class);
        $episode = create(Episode::class, [
            'season_id' => $season,
        ]);

        $seasonTwo   = create(Season::class, [
            'series_id' => $season->series_id,
            'number' => $season->number + 1,
        ]);
        $seasonTwoEpisodeOne = create(Episode::class, [
            'season_id' => $seasonTwo,
            'number' => 1,
        ]);

        $this->post("/seasons/{$season->id}/seen-episodes");

        $this->assertDatabaseHas('series_progresses', [
            'user_id' => auth()->id(),
            'series_id' => $season->series_id,
            'latest_seen_episode_id' => $episode->id,
            'next_episode_id' => $seasonTwoEpisodeOne->id,
        ]);
    }

    /** @test */
    function when_there_is_no_more_episodes_the_next_episode_id_will_be_null()
    {
        $this->signIn();

        $season   = create(Season::class);
        $episode = create(Episode::class, [
            'season_id' => $season,
        ]);

        $this->post("/seasons/{$season->id}/seen-episodes");

        $this->assertDatabaseHas('series_progresses', [
            'user_id' => auth()->id(),
            'series_id' => $season->series_id,
            'latest_seen_episode_id' => $episode->id,
            'next_episode_id' => null,
        ]);
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

