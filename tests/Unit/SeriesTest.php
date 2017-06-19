<?php

namespace Tests\Unit;

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
}

