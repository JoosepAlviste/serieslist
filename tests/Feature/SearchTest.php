<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Series;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function series_can_be_searched_by_their_title()
    {
        $series    = create(Series::class, [
            'title' => 'Test title',
        ]);
        $seriesTwo = create(Series::class, [
            'title' => 'Not searchable title',
        ]);

        $query = 'test t';

        $this->get("/search?q={$query}")
             ->assertSee($series->title)
             ->assertDontSee($seriesTwo->title);
    }

    /** @test */
    function series_can_be_searched_by_their_description()
    {
        $series    = create(Series::class, [
            'description' => 'Test description',
        ]);
        $seriesTwo = create(Series::class, [
            'description' => 'Not searchable description',
        ]);

        $query = 'test desc';

        $this->get("/search?q={$query}")
             ->assertSee($series->title)
             ->assertDontSee($seriesTwo->title);
    }

    /** @test */
    function episodes_can_be_searched_by_their_title()
    {
        $episode    = create(Episode::class, [
            'title' => 'Test title',
        ]);
        $episodeTwo = create(Episode::class, [
            'title' => 'Not searchable title',
        ]);

        $query = 'test t';

        $this->get("/search?q={$query}")
             ->assertSee($episode->title)
             ->assertDontSee($episodeTwo->title);
    }
}

