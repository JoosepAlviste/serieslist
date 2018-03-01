<?php

namespace Tests\Feature;

use App\Models\SeriesStatusType;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeriesStatusTypeTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function it_can_prettify_its_slug()
    {
        $statusType = create(SeriesStatusType::class, [
            'status' => 'in-progress',
        ]);

        $this->assertEquals('In progress', $statusType->pretty);
    }
}
