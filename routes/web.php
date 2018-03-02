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
| Pages
|--------------------------------------------------------------------------
*/

Auth::routes();

Route::get('/', 'PagesController@welcome');
Route::get('home', 'PagesController@home')->name('home')->middleware('auth');

/*** Search ***/

Route::get('search', 'SearchController@index')->name('search');
Route::get('series/search', 'SearchController@series')->name('search.series');
Route::get('episodes/search', 'SearchController@episodes')->name('search.episodes');


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
Route::put('series/{series}/status', 'Api\SeriesStatusController@update')->middleware('auth');
Route::delete('series/{series}/status', 'Api\SeriesStatusController@destroy')->middleware('auth');


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

Route::get('list', 'PagesController@seriesList')->middleware('auth');
Route::get('users/{user}/series', 'Api\SeriesListController@index');


/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

Route::get('settings', 'UserSettingsController@edit')->middleware('auth');

Route::post('settings/password', 'PasswordChangeController@update')->middleware('auth');
