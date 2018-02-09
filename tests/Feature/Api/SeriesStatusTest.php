<?php

namespace Tests\Feature;

use App\Models\Series;
use App\Models\SeriesStatusType;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeriesStatusTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function series_status_can_be_changed()
    {
        $this->signIn();

        /** @var Series $series */
        $series = create(Series::class);

        $this->updateSeriesStatus($series->id, 1);

        $this->assertEquals(1, $series->statusForUser()->series_status_type_code);
	}

	/** @test */
	function series_status_cannot_be_changed_as_a_guest()
	{
	    $this->withExceptionHandling();

        /** @var Series $series */
        $series = create(Series::class);

        $response = $this->updateSeriesStatus($series->id, 1);

        $response->assertStatus(401);
        $this->assertDatabaseMissing('series_statuses', []);
	}

	/** @test */
	function updating_series_status_requires_a_status_type_code()
	{
        $this->withExceptionHandling();
        $this->signIn();

        /** @var Series $series */
        $series = create(Series::class);

        $response = $this->updateSeriesStatus($series->id, null);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('series_statuses', []);
	}

    /** @test */
    function updating_series_status_requires_an_existing_status_type_code()
    {
        $this->withExceptionHandling();
        $this->signIn();

        /** @var Series $series */
        $series = create(Series::class);
        $seriesStatusType = SeriesStatusType::all()->last();

        $response = $this->updateSeriesStatus($series->id, $seriesStatusType->code + 1);

        $response->assertStatus(422);
        $this->assertDatabaseMissing('series_statuses', []);
    }

    /** @test */
    function updating_series_status_overwrites_older_status()
    {
        $this->signIn();

        /** @var Series $series */
        $series = create(Series::class);

        $this->updateSeriesStatus($series->id, 1);
        $this->updateSeriesStatus($series->id, 2);

        $this->assertEquals(2, $series->statusForUser()->series_status_type_code);
        $this->assertDatabaseMissing('series_statuses', ['series_status_type_code' => 1]);
    }

    protected function updateSeriesStatus($seriesId, $code)
    {
        return $this->json('put', "/series/{$seriesId}/status", [
            'code' => $code,
        ]);
    }
}
