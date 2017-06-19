<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeriesTest extends TestCase
{
    use DatabaseMigrations;

    /** @var Series */
    protected $series;

    public function setUp()
    {
        parent::setUp();

        $this->series = create(Series::class);
    }

    /** @test */
    function a_series_has_seasons()
    {
        $season = create(Season::class, ['series_id' => $this->series->id]);

        $this->assertTrue($this->series->seasons->contains($season));
    }

    /** @test */
    function a_series_can_make_a_string_path()
    {
        $this->assertEquals("/series/{$this->series->id}", $this->series->path());
    }

    /** @test */
    function a_series_can_add_a_season()
    {
        $season = make(Season::class, [
            'series_id' => null,
        ])->toArray();

        $this->series->addSeason($season);

        $this->assertDatabaseHas('seasons', [
            'series_id' => $this->series->id,
            'number' => $season['number'],
        ]);
    }

    /** @test */
    function it_deletes_all_its_seasons_on_deletion()
    {
        create(Season::class, ['series_id' => $this->series->id], 5);

        $this->series->delete();

        $this->assertDatabaseMissing('seasons', [
            'series_id' => $this->series->id,
        ]);
    }

    /** @test */
    function it_deletes_all_its_episodes_on_deletion()
    {
        $seasons = create(Season::class, ['series_id' => $this->series->id], 3);
        $seasons->each(function ($season) {
            create(Episode::class, ['season_id' => $season->id], 3);
        });

        $this->series->delete();

        $seasons->each(function ($season) {
            $this->assertDatabaseMissing('episodes', [
                'season_id' => $season->id,
            ]);
        });
    }
}
