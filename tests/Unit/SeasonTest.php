<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeasonTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_season_belongs_to_a_series()
    {
        $season = create(Season::class);

        $this->assertInstanceOf(Series::class, $season->series);
    }

    /** @test */
    function a_season_can_make_a_string_path()
    {
        $season = create(Season::class);

        $this->assertEquals(
            "/series/{$season->series->id}/seasons/{$season->number}",
            $season->path()
        );
    }

    /** @test */
    function a_season_consists_of_episodes()
    {
        $season = create(Season::class);
        $episode = create(Episode::class, [
            'season_id' => $season->id
        ]);

        $this->assertTrue($season->episodes->contains($episode));
    }

    /** @test */
    function a_season_can_add_an_episode()
    {
        $season = create(Season::class);
        $episode = make(Episode::class, [
            'season_id' => null
        ]);

        $season->addEpisode($episode->toArray());

        $this->assertDatabaseHas('episodes', [
            'season_id' => $season->id,
            'title' => $episode->title,
        ]);
    }
}
