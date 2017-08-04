<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


/*
|--------------------------------------------------------------------------
| Series
|--------------------------------------------------------------------------
*/

Route::get('series', 'SeriesController@index');
Route::post('series', 'SeriesController@store')->middleware('can:create,App\Models\Series');
Route::get('series/create', 'SeriesController@create')->middleware('can:create,App\Models\Series');
Route::get('series/{series}', 'SeriesController@show');
Route::put('series/{series}', 'SeriesController@update')->middleware('can:update,series');
Route::get('series/{series}/edit', 'SeriesController@edit')->middleware('can:update,series');
Route::delete('series/{series}', 'SeriesController@destroy')->middleware('can:delete,series');


/*
|--------------------------------------------------------------------------
| Seasons
|--------------------------------------------------------------------------
*/

Route::get('series/{series}/seasons/{season}', 'SeasonsController@show');


/*
|--------------------------------------------------------------------------
| Episodes
|--------------------------------------------------------------------------
*/

Route::get('series/{series}/episodes/{episode}', 'EpisodesController@show');


/*
|--------------------------------------------------------------------------
| Seen Episodes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')
    ->post('episodes/{episode}/seen-episodes', 'SeenEpisodesController@toggle');
Route::middleware('auth')
    ->post('seasons/{season}/seen-episodes', 'SeenEpisodesController@markSeasonAsSeen');


/*
|--------------------------------------------------------------------------
| Lists
|--------------------------------------------------------------------------
*/

Route::get('list', 'ListController@index')->middleware('auth');
Route::get('users/{user}/series', 'Api\SeriesController@inProgressSeries');


/*
|--------------------------------------------------------------------------
| Pages
|--------------------------------------------------------------------------
*/

Auth::routes();

Route::get('/', 'PagesController@welcome');
Route::get('home', 'PagesController@home')->name('home')->middleware('auth');
