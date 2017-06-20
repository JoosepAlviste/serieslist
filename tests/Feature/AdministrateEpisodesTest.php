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
                [ 'title' => 'Test title', 'number' => 1 ],
            ],
        ]];

        // If the series is saved (post request)
        $this->post("/series", $series);

        // Then the database should contain the episode
        $this->assertDatabaseHas('episodes', [
            'season_id' => Series::first()->seasons->first()->id,
            'title' => 'Test title',
            'number' => 1,
        ]);
    }

    /** @test */
    function an_admin_user_can_update_existing_episodes()
    {
        $this->signInAdmin();

        /** @var Episode $episode */
        $episode = create(Episode::class);
        $params = $episode->season->series->toArray();
        $params['seasons'] = [$episode->season->makeHidden('series')->load('episodes')->toArray()];

        $params['seasons'][0]['episodes'][0]['title'] = 'Test title';

        $this->put($episode->season->series->path(), $params);

        $this->assertDatabaseHas('episodes', [
            'title' => 'Test title',
        ]);
    }

    /** @test */
    function an_admin_user_can_add_new_episodes_while_updating()
    {
        $this->signInAdmin();

        /** @var Episode $episode */
        $episode = create(Episode::class, ['number' => 1]);
        $params = $episode->season->series->toArray();
        $params['seasons'] = [$episode->season->makeHidden('series')->load('episodes')->toArray()];

        $params['seasons'][0]['episodes'][0]['title'] = 'Test title';
        $params['seasons'][0]['episodes'][] = [ 'title' => 'New episode', 'number' => 2 ];

        $this->put($episode->season->series->path(), $params);

        $this->assertDatabaseHas('episodes', [
            'id' => $episode->id,
            'title' => 'Test title',
        ]);
        $this->assertDatabaseHas('episodes', [
            'title' => 'New episode',
        ]);
    }
}
