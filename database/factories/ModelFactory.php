<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Models\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name'           => $faker->name,
        'email'          => $faker->unique()->safeEmail,
        'password'       => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\Models\Series::class, function (Faker\Generator $faker) {
    return [
        'title'       => $faker->sentence,
        'description' => $faker->paragraph,
        'start_year'  => $faker->year,
        'end_year'    => $faker->year,
    ];
});

$factory->define(App\Models\Season::class, function (Faker\Generator $faker) {
    return [
        'number'    => $faker->numberBetween(1, 10),
        'series_id' => function () {
            return factory(\App\Models\Series::class)->create()->id;
        },
    ];
});

$factory->define(App\Models\Episode::class, function (Faker\Generator $faker) {
    return [
        'season_id' => function () {
            return create(\App\Models\Season::class)->id;
        },
        'title' => $faker->words(4, true),
    ];
});
