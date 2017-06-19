<?php

namespace Tests\Unit;

use App\Models\Season;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeriesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_series_has_seasons()
    {
        $series = create(Series::class);
        $season = create(Season::class, ['series_id' => $series->id]);

        $this->assertTrue($series->seasons->contains($season));
    }

    /** @test */
    function a_series_can_make_a_string_path()
    {
        $series = create(Series::class);

        $this->assertEquals("/series/{$series->id}", $series->path());
    }

    /** @test */
    function a_series_can_add_a_season()
    {
        $series = create(Series::class);
        $season = make(Season::class, [
            'series_id' => null,
        ])->toArray();

        $series->addSeason($season);

        $this->assertDatabaseHas('seasons', [
            'series_id' => $series->id,
            'number' => $season['number'],
        ]);
    }
}

