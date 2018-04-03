<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Season;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class EpisodeTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_visitor_can_view_info_about_episodes()
    {
        $episode = create(Episode::class);

        $this->get($episode->path())
             ->assertSee($episode->title);
    }

    /** @test */
    function a_visitor_can_see_all_episodes_of_one_season()
    {
        $season = create(Season::class);
        $episodes = create(Episode::class, [
            'season_id' => $season->id,
        ], 3);

        $response = $this->get("{$season->path()}");

        $episodes->each(function ($episode) use ($response) {
            $response->assertSee($episode->title);
        });
    }
}

