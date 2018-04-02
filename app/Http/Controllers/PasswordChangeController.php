<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasswordChange;
use App\Models\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class PasswordChangeController.
 * Handles changing passwords for users.
 *
 * @package App\Http\Controllers
 */
class PasswordChangeController extends Controller
{
    use ResetsPasswords;

    /**
     * Change the password for the currently logged in user.
     *
     * @param PasswordChange $request
     *
     * @return RedirectResponse|Redirector
     */
    public function update(PasswordChange $request)
    {
        $user = auth()->user();
        $hasher = app('hash');

        $isCorrectPassword = $hasher->check(
            $request->input('current-password'),
            $user->password
        );

        if (!$isCorrectPassword) {
            throw ValidationException::withMessages([
                'current-password' => [trans('auth.failed')],
            ]);
        }

        $newPassword = $request->input('new-password');

        $this->resetPassword(auth()->user(), $newPassword);

        return redirect('/settings')
            ->with('status', 'Password reset successfully!');
    }
}
