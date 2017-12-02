<?php

namespace App\Http\Controllers;

class UserSettingsController extends Controller
{
    public function edit()
    {
        return view('users.settings.edit');
    }
}
