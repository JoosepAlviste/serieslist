<?php

namespace App\Http\Controllers;

class UserSettingsController extends Controller
{
    /**
     * Show the user's settings page where they can edit their account settings.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function edit()
    {
        return view('users.settings.edit');
    }
}
