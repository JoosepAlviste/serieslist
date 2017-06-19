<?php

namespace Tests\Feature;

use App\Models\Episode;
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

        $series = create(Series::class);
        $season = create(Season::class, ['series_id' => $series->id]);

        $seriesArray = $series->toArray();
        $seriesArray['seasons'] = [
            ['number' => 1],
            ['number' => 2],
        ];

        $this->put($series->path(), $seriesArray);

        $this->assertDatabaseHas('seasons', [
            'series_id' => $series->id,
            'number' => 1,
        ]);
        $this->assertDatabaseHas('seasons', [
            'series_id' => $series->id,
            'number' => 2,
        ]);
    }

    /** @test */
    function when_a_season_is_updated_its_episodes_are_not_deleted()
    {
        $this->signInAdmin();

        $season = create(Season::class, ['number' => 1]);
        $episode = create(Episode::class, ['season_id' => $season->id]);

        $params = $season->series->toArray();
        $params['seasons'] = [
            ['number' => 1, 'episodes' => [$episode->toArray()]],
        ];

        $this->put($season->series->path(), $params);

        $this->assertDatabaseHas('episodes', [
            'id' => $episode->id,
        ]);
    }
}
