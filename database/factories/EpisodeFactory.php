<?php

use App\Models\Episode;
use Faker\Generator as Faker;

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(Episode::class, function (Faker $faker) {
    return [
        'number'    => $faker->numberBetween(1, 10),
        'title' => $faker->words(4, true),
        'season_id' => function () {
            return create(\App\Models\Season::class)->id;
        },
    ];
});
