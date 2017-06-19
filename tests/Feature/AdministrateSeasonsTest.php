<?php

namespace Tests\Feature;

use App\Models\Series;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class AdministrateSeasonsTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function an_admin_user_can_create_seasons()
    {
        $this->signInAdmin();

        $series = make(Series::class)->toArray();
        $series['seasons'] = [
            [ 'number' => 1, ],
            [ 'number' => 2, ],
        ];

        $this->post('/series', $series);

        $this->assertDatabaseHas('seasons', [
            'series_id' => Series::first()->id,
            'number' => 1,
        ]);
        $this->assertDatabaseHas('seasons', [
            'series_id' => Series::first()->id,
            'number' => 2,
        ]);
    }
}
