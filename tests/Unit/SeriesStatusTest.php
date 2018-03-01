<?php

namespace Tests\Unit;

use App\Models\Series;
use App\Models\SeriesStatus;
use App\Models\SeriesStatusType;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeriesStatusTest extends TestCase
{
    use DatabaseMigrations;

    /** @var SeriesStatus */
    private $status;

    public function setUp()
    {
        parent::setUp();

        $this->status = create(SeriesStatus::class);
    }

    /** @test */
    function a_user_can_have_a_status_for_a_series()
    {
        /** @var User $user */
        $user = create(User::class);
        /** @var Series $series */
        $series = create(Series::class);
        $statusCode = SeriesStatusType::first()->code;

        $series->updateSeriesStatus($statusCode, $user->id);

        $seriesStatus = $series->statusForUser($user->id);

        $this->assertEquals($statusCode, $seriesStatus->series_status_type_code);
	}

	/** @test */
	function it_has_a_status_type()
	{
	    $this->assertInstanceOf(SeriesStatusType::class, $this->status->type);
	}

    /** @test */
    function it_has_a_user()
    {
        $this->assertInstanceOf(User::class, $this->status->user);
    }

    /** @test */
    function it_has_a_series()
    {
        $this->assertInstanceOf(Series::class, $this->status->series);
    }

    /** @test */
    function a_series_can_delete_the_status_for_it_and_a_user()
    {
        /** @var User $user */
        $user = create(User::class);

        /** @var SeriesStatus $seriesStatus */
        $seriesStatus = create(SeriesStatus::class, ['user_id' => $user->id]);
        $seriesStatus->series->removeStatusForUser($user->id);

        $this->assertDatabaseMissing('series_statuses', [
            'id' => $seriesStatus->id
        ]);
    }
}
