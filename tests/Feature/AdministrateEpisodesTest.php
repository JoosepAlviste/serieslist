<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Season;
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

        $params = $this->createEpisodeAndGetAsParams();

        $params['seasons'][0]['episodes'][0]['title'] = 'Test title';

        $this->put("/series/{$params['id']}", $params);

        $this->assertDatabaseHas('episodes', [
            'id' => $params['seasons'][0]['episodes'][0]['id'],
            'title' => 'Test title',
        ]);
    }

    /** @test */
    function an_admin_user_can_add_new_episodes_while_updating()
    {
        $this->signInAdmin();

        $params = $this->createEpisodeAndGetAsParams(['number' => 1]);

        $params['seasons'][0]['episodes'][0]['title'] = 'Test title';
        $params['seasons'][0]['episodes'][] = [ 'title' => 'New episode', 'number' => 2 ];

        $this->put("/series/{$params['id']}", $params);

        $this->assertDatabaseHas('episodes', [
            'id' => $params['id'],
            'title' => 'Test title',
        ]);
        $this->assertDatabaseHas('episodes', [
            'title' => 'New episode',
        ]);
    }

    /** @test */
    function updating_and_adding_a_season_correctly_adds_new_episodes()
    {
        $this->signInAdmin();

        $savedSeries = create(Series::class);

        $updatedSeries = $savedSeries->toArray();
        $updatedSeries['seasons'][] = ['number' => 1, 'episodes' => []];
        $updatedSeries['seasons'][0]['episodes'][] = [
            'title' => 'test', 'number' => 0,
        ];

        $this->put("/series/{$savedSeries->id}", $updatedSeries);

        $this->assertCount(1, $savedSeries->fresh()->seasons[0]->episodes);
    }

    protected function createEpisodeAndGetAsParams($overrides = [])
    {
        $episode = create(Episode::class, $overrides);
        $params = $episode->season->series->toArray();
        $params['seasons'] = [$episode->season->makeHidden('series')->load('episodes')->toArray()];

        return $params;
    }
}
