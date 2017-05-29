<?php

namespace Tests\Feature;

use App\Models\Series;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class AdministrateSeriesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function an_admin_user_can_create_a_series()
    {
        $this->signInAdmin();

        $series = make(Series::class);
        $this->post('/series', $series->toArray());

        $this->assertDatabaseHas('series', $series->toArray());
    }

    /** @test */
    public function a_user_who_is_not_an_admin_may_not_create_a_series()
    {
        $this->withExceptionHandling()
             ->signIn();

        $series = make(Series::class);
        $this->post('/series', $series->toArray())
             ->assertStatus(403);

        $this->assertDatabaseMissing('series', $series->toArray());
    }

    /** @test * */
    public function an_admin_user_can_see_series_create_form()
    {
        $this->signInAdmin();

        $status = $this->get('/series/create');

        $status->assertStatus(200)
               ->assertSee('Create a new series');
    }

    /** @test * */
    public function a_user_who_is_not_an_admin_may_not_see_the_create_series_form()
    {
        $this->withExceptionHandling()
             ->signIn();

        $this->get('/series/create')
             ->assertStatus(403);
    }
}

