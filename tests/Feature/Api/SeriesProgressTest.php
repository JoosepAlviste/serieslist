<?php

namespace Tests\Feature\Api;

use App\Models\Episode;

class SeriesProgressTest extends SeenEpisodeTest
{
    /** @test */
    function when_an_episode_is_marked_as_seen_the_progresses_table_is_updated()
    {
        $episode = create(Episode::class);
        $episodeTwo = create( Episode::class, [
            'season_id' => $episode->season_id,
            'number' => $episode->number + 1
        ]);

        $this->markEpisodeSeen($episode);

        $this->assertDatabaseHas('series_progresses', [
            'latest_seen_episode_id' => $episode->id,
            'next_episode_id' => $episodeTwo->id,
        ]);
    }

    /** @test */
    function if_there_is_no_next_episode_the_next_episode_id_will_be_null()
    {
        $episode = create(Episode::class);

        $this->markEpisodeSeen($episode);

        $this->assertDatabaseHas('series_progresses', [
            'latest_seen_episode_id' => $episode->id,
            'next_episode_id' => null,
        ]);
    }
}
