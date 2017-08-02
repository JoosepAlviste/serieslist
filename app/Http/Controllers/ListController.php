<?php

namespace App\Http\Controllers;

/**
 * Class ListController.
 *
 * @package App\Http\Controllers
 */
class ListController extends Controller
{
    /**
     * Render the list view.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view('list.index');
    }
}
