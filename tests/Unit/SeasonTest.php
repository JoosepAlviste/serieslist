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
            'season_id' => null,
        ]);

        $this->season->addEpisode($episode->toArray());

        $this->assertDatabaseHas('episodes', [
            'season_id' => $this->season->id,
            'title' => $episode->title,
            'number' => $episode->number,
        ]);
    }

    /** @test */
    function it_deletes_all_its_episodes_on_deletion()
    {
        create(Episode::class, ['season_id' => $this->season->id], 5);

        $this->season->delete();

        $this->assertDatabaseMissing('episodes', [
            'season_id' => $this->season->id,
        ]);
    }

    /** @test */
    function it_can_update_its_episodes()
    {
        /** @var Season $season */
        $season = create(Season::class);
        $oldEpisodes = create(Episode::class, ['season_id' => $season->id], 2);

        $episodes = $season->episodes->toArray();
        $episodes[0]['title'] = 'Test title';

        $season->updateEpisodes($episodes);

        $this->assertDatabaseHas('episodes', [
            'id' => $oldEpisodes[0]->id,
            'title' => 'Test title',
        ]);
    }
}
