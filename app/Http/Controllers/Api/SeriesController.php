<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Series;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

/**
 * Class SeriesController.
 *
 * @package App\Http\Controllers\Api
 */
class SeriesController extends Controller
{
    /**
     * Get the in progress series for the currently authenticated
     * user.
     *
     * @return Series[]|Collection
     */
    public function inProgressSeries()
    {
        return Auth::user()->inProgressSeries();
    }
}
