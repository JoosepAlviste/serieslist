<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;

/**
 * Class PagesController.
 * Used to display static pages, just to render views.
 *
 * @package App\Http\Controllers
 */
class PagesController extends Controller
{
    /**
     * Display the home view.
     *
     * @return Factory|View
     */
    public function home()
    {
        return view('pages.home');
    }

    /**
     * Display the welcome view.
     *
     * @return Factory|View
     */
    public function welcome()
    {
        return view('pages.welcome');
    }

    /**
     * Display the in progress series' list view.
     *
     * @return Factory|View
     */
    public function seriesList()
    {
        return view('list.index');
    }
}
