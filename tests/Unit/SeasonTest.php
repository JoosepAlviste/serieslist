<?php

namespace Tests\Unit;

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
}

