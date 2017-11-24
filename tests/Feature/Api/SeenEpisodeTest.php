<?php

namespace Tests\Feature\Api;

use App\Models\Episode;
use App\Models\SeenEpisode;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeenEpisodeTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function when_an_episode_is_marked_as_seen_the_next_episode_will_be_returned()
    {
        $episode = create(Episode::class);
        $episodeTwo = create(
            Episode::class,
            ['season_id' => $episode->season_id, 'number' => $episode->number + 1]
        );

        $response = $this->markEpisodeSeen($episode);

        $response->assertJsonFragment([
            'next_episode_id' => $episodeTwo->id,
        ]);
    }

    /** @test */
    function when_there_is_no_next_episode_null_will_be_returned()
    {
        $episode = create(Episode::class);

        $response = $this->markEpisodeSeen($episode);

        $response->assertJsonFragment([
            'next_episode_id' => null,
        ]);
    }

    protected function markEpisodeSeen($episode = null)
    {
        if (!auth()->check()) {
            $this->signIn();
        }

        $episode = $episode ?: create(Episode::class);
        $response = $this->json('post', "/episodes/{$episode->id}/seen-episodes");

        return $response;
    }
}

