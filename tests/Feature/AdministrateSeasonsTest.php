<?php

namespace Tests\Feature;

use App\Models\Season;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class AdministrateSeasonsTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function an_admin_user_can_create_seasons()
    {
        $this->signInAdmin();

        $series = make(Series::class)->toArray();
        $series['seasons'] = [
            [ 'number' => 1, ],
            [ 'number' => 2, ],
        ];

        $this->post('/series', $series);

        $this->assertDatabaseHas('seasons', [
            'series_id' => Series::first()->id,
            'number' => 1,
        ]);
        $this->assertDatabaseHas('seasons', [
            'series_id' => Series::first()->id,
            'number' => 2,
        ]);
    }

    /** @test */
    function an_admin_user_can_update_seasons_of_series()
    {
        $this->signInAdmin();

        // Given we have a saved series with some seasons
        $series = create(Series::class);
        $season = create(Season::class, ['series_id' => $series->id]);

        $seriesArray = $series->toArray();
        $seriesArray['seasons'] = [
            ['number' => 1],
            ['number' => 2],
        ];

        // If we send a request to update the series with new seasons
        $this->put($series->path(), $seriesArray);

        // The database should now contain the new seasons
        $this->assertDatabaseHas('seasons', [
            'series_id' => $series->id,
            'number' => 1,
        ]);
        $this->assertDatabaseHas('seasons', [
            'series_id' => $series->id,
            'number' => 2,
        ]);
    }
}
