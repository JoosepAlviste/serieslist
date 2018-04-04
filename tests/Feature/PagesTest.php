<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class PagesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function it_displays_the_welcome_page()
    {
        $this->assertPageWorks('/', 'Serieslist');
    }

    /** @test */
    function it_displays_the_home_page_for_logged_in_users()
    {
        $this->assertUsersCanAccess('/home', 'Serieslist');
    }

    /** @test */
    function it_does_not_display_the_home_page_for_guests()
    {
        $this->assertGuestsCannotAccess('/home');
    }

    /** @test */
    function it_displays_the_list_page_for_logged_in_users()
    {
        $this->assertUsersCanAccess('/list', 'My series list');
    }

    /** @test */
    function it_does_not_display_the_list_page_for_guests()
    {
        $this->assertGuestsCannotAccess('/list');
    }

    /** @test */
    function the_list_view_filter_defaults_to_all()
    {
        $this->signIn();
        $response = $this->get('/list/test');

        $response->assertViewHas('filter', 'all');
    }

    /** @test */
    function a_logged_in_user_cannot_visit_the_login_page()
    {
        $this->signIn();

        $this->get('/login')
            ->assertStatus(302)
            ->assertRedirect('/home');
    }

    protected function assertUsersCanAccess($uri, $content = null)
    {
        return $this->signIn()
            ->assertPageWorks($uri, $content);
    }

    protected function assertGuestsCannotAccess($uri)
    {
        $this->withExceptionHandling();

        return $this->get($uri)
             ->assertStatus(302)
             ->assertRedirect('/login');
    }

    protected function assertPageWorks($uri, $content = null)
    {
        $response = $this->get($uri)
            ->assertStatus(200);

        return tap($response, function ($response) use ($content) {
            if ($content) {
                $response->assertSee($content);
            }
        });
    }
}

