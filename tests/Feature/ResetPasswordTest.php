<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class ResetPasswordTest extends TestCase
{
    use DatabaseMigrations;

    /** @var Hasher */
    private $hasher;

    public function setUp()
    {
        parent::setUp();

        $this->hasher = app('hash');
    }

    /** @test */
    function a_user_can_change_their_password()
    {
        $this->signIn();

        $result = $this->resetPassword();

        $result->assertStatus(302)
            ->assertRedirect('/settings');

        $this->assertUserHasNewPassword();
    }

    /** @test */
    function resetting_password_requires_the_current_password()
    {
        $this->assertValidationErrors('current-password', [
            'new-password' => 'secret2',
            'confirm-new-password' => 'secret2',
        ]);
    }

    /** @test */
    function resetting_password_requires_correct_current_password()
    {
        $this->assertValidationErrors('current-password', [
            'current-password' => 'wrong',
            'new-password' => 'secret2',
            'confirm-new-password' => 'secret2',
        ]);
    }

    /** @test */
    function new_password_is_required()
    {
        $this->assertValidationErrors('new-password', [
            'current-password' => 'secret',
            'confirm-new-password' => 'secret2',
        ]);
    }

    /** @test */
    function confirm_new_password_is_required()
    {
        $this->assertValidationErrors('confirm-new-password', [
            'current-password' => 'secret',
            'new-password' => 'secret2',
        ]);
    }

    /** @test */
    function new_password_must_be_confirmed()
    {
        $this->assertValidationErrors('new-password', [
            'current-password' => 'secret',
            'new-password' => 'secret2',
            'confirm-new-password' => 'secret-different',
        ]);
    }

    /** @test */
    function a_guest_may_not_reset_passwords()
    {
        $this->withExceptionHandling();

        $result = $this->resetPassword([]);

        $result->assertRedirect('/login');
    }

    protected function resetPassword($args = null)
    {
        $args = $args ?: [
            'current-password' => 'secret',
            'new-password' => 'secret2',
            'confirm-new-password' => 'secret2',
        ];

        return $this->post('/settings/password', $args);
    }

    protected function assertUserHasNewPassword()
    {
        $user = User::first();

        $this->assertTrue($this->hasher->check('secret2', $user->password));
    }

    protected function assertUserHasOldPassword()
    {
        $user = User::first();

        $this->assertTrue($this->hasher->check('secret', $user->password));
    }

    /**
     * @return User
     */
    protected function authSetup()
    {
        $this->signIn($user = create(User::class));

        $this->withExceptionHandling();

        return $user;
    }

    protected function assertValidationErrors($field, $args = [])
    {
        $this->authSetup();

        $result = $this->resetPassword($args);

        $result->assertSessionHasErrors($field);

        $this->assertUserHasOldPassword();
    }
}
