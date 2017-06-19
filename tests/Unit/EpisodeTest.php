<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class EpisodeTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function an_episode_belongs_to_a_season()
    {
        $episode = create(Episode::class);

        $this->assertInstanceOf(Season::class, $episode->season);
    }

    /** @test */
    function an_episode_can_make_a_string_path()
    {
        $episode = create(Episode::class);

        $this->assertEquals(
            "/series/{$episode->season->series->id}/episodes/{$episode->id}",
            $episode->path()
        );
    }
}
