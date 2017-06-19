<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeasonTest extends TestCase
{
    use DatabaseMigrations;

    /** @var Season */
    protected $season;

    public function setUp()
    {
        parent::setUp();

        $this->season = create(Season::class);
    }

    /** @test */
    function a_season_belongs_to_a_series()
    {
        $this->assertInstanceOf(Series::class, $this->season->series);
    }

    /** @test */
    function a_season_can_make_a_string_path()
    {
        $this->assertEquals(
            "/series/{$this->season->series->id}/seasons/{$this->season->number}",
            $this->season->path()
        );
    }

    /** @test */
    function a_season_consists_of_episodes()
    {
        $episode = create(Episode::class, [
            'season_id' => $this->season->id
        ]);

        $this->assertTrue($this->season->episodes->contains($episode));
    }

    /** @test */
    function a_season_can_add_an_episode()
    {
        $episode = make(Episode::class, [
            'season_id' => null
        ]);

        $this->season->addEpisode($episode->toArray());

        $this->assertDatabaseHas('episodes', [
            'season_id' => $this->season->id,
            'title' => $episode->title,
        ]);
    }
}
