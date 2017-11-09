<?php

use App\Models\Season;
use Faker\Generator as Faker;

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(Season::class, function (Faker $faker) {
    return [
        'number'    => $faker->numberBetween(1, 10),
        'series_id' => function () {
            return factory(\App\Models\Series::class)->create()->id;
        },
    ];
});

