<?php

namespace App\Http\Controllers;

class PagesController extends Controller
{
    /**
     * Display the home view.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function home()
    {
        return view('pages.home');
    }

    /**
     * Display the welcome view.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function welcome()
    {
        return view('pages.welcome');
    }
}
