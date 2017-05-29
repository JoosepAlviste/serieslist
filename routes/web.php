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

Route::get('/', function () {
    return view('pages.welcome');
});

Route::get('series', 'SeriesController@index');
Route::post('series', 'SeriesController@store')->middleware('can:create,App\Models\Series');
Route::get('series/create', 'SeriesController@create')->middleware('can:create,App\Models\Series');
Route::get('series/{series}', 'SeriesController@show');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
