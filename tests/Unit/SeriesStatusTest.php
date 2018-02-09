<?php

namespace Tests\Unit;

use App\Models\Series;
use App\Models\SeriesStatusType;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeriesStatusTest extends TestCase
{
    use DatabaseMigrations;

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
}
