<?php

namespace Tests\Feature;

use App\Models\Series;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class AdministrateSeriesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function an_admin_user_can_create_a_series()
    {
        $this->signIn(factory(User::class)->create([
            'is_admin' => true,
        ]));

        $series = factory(Series::class)->make();
        $this->post('/series', $series->toArray());

        $this->assertDatabaseHas('series', $series->toArray());
    }

    /** @test */
    public function a_user_who_is_not_an_admin_may_not_create_a_series()
    {
        $this->withExceptionHandling()
             ->signIn();

        $series = factory(Series::class)->make();
        $this->post('/series', $series->toArray())
             ->assertStatus(403);

        $this->assertDatabaseMissing('series', $series->toArray());
    }
}

