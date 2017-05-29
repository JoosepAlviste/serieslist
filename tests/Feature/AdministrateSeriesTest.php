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

    /** @test */
    public function a_series_requires_a_title()
    {
        $this->createSeries(['title' => null])
             ->assertSessionHasErrors('title');
    }

    /** @test */
    public function a_series_requires_a_description()
    {
        $this->createSeries(['description' => null])
             ->assertSessionHasErrors('description');
    }

    /** @test */
    public function a_series_requires_a_numeric_start_year()
    {
        $this->createSeries(['start_year' => null])
             ->assertSessionHasErrors('start_year');

        $this->createSeries(['start_year' => 'testing'])
             ->assertSessionHasErrors('start_year');
    }

    /** @test */
    public function a_series_can_have_a_numeric_end_year()
    {
        $this->createSeries(['end_year' => 'testing'])
             ->assertSessionHasErrors('end_year');
    }

    protected function createSeries($overrides = [])
    {
        $this->withExceptionHandling()
             ->signInAdmin();
        $series = make(Series::class, $overrides);

        return $this->post('/series', $series->toArray());
    }
}
