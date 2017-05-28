<?php

namespace Tests\Feature;

use App\Models\Series;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class AdministrateSeriesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function an_admin_user_can_create_a_thread()
    {
        $this->signIn(factory(User::class)->create([
            'is_admin' => true,
        ]));

        $series = factory(Series::class)->make();
        $this->post('/series', $series->toArray());

        $this->assertDatabaseHas('series', $series->toArray());
    }
}

