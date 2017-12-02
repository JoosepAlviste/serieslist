<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class UserSettingsTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    function a_user_can_visit_their_settings()
    {
        $this->signIn();

        $this->get('/settings')
            ->assertStatus(200)
            ->assertSee('Settings');
    }

    /** @test */
    function a_guest_cannot_visit_settings()
    {
        $this->withExceptionHandling();

        $this->get('/settings')
            ->assertRedirect('/login');
    }
}
