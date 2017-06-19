<?php

namespace Tests\Feature;

use App\Models\Season;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeasonTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_visitor_can_see_seasons_of_a_series()
    {
        $series = create(Series::class);
        $season = create(Season::class, ['series_id' => $series->id]);

        $this->get("/series/{$series->id}")
             ->assertSee('Season ' . $season->number);
    }
}
