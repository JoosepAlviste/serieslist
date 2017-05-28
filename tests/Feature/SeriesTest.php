<?php

namespace Tests\Feature;

use App\Models\Series;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class SeriesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function a_user_can_browse_all_series()
    {
        $series = factory(Series::class, 2)->create();

        $this->get('/series')
             ->assertSee($series[0]->title)
             ->assertSee($series[1]->title);
    }

    /** @test */
    public function a_user_can_see_info_about_one_series()
    {
        $series = factory(Series::class)->create();

        $this->get("/series/{$series->id}")
             ->assertSee($series->title)
             ->assertSee($series->description);
    }
}

