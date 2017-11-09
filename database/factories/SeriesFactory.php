<?php

use App\Models\Series;
use Faker\Generator as Faker;

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(Series::class, function (Faker $faker) {
    return [
        'title'       => $faker->sentence,
        'description' => $faker->paragraph,
        'start_year'  => $faker->year,
        'end_year'    => $faker->year,
    ];
});
