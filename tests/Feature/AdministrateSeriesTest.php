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
        // Given an admin user is logged in
        $user = factory(User::class)->create([
            'is_admin' => true,
        ]);

        $this->signIn($user);

        // If a request to create a series is received
        $series = factory(Series::class)->make();
        $this->post('/series', $series->toArray());

        // A series should be created with the given parameters
        $this->assertDatabaseHas('series', $series->toArray());
    }
}

