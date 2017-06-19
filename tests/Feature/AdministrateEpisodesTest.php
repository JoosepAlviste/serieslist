<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class AdministrateEpisodesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function an_admin_user_can_save_episodes_for_series()
    {
        $this->signInAdmin();

        // Given we have a series array with an episode in it
        $series = make(Series::class)->toArray();
        $series['seasons'] = [[
            'number' => 1,
            'episodes' => [
                [ 'title' => 'Test title' ],
            ],
        ]];

        // If the series is saved (post request)
        $this->post("/series", $series);

        // Then the database should contain the episode
        $this->assertDatabaseHas('episodes', [
            'season_id' => Series::first()->seasons->first()->id,
            'title' => 'Test title',
        ]);
    }
}

