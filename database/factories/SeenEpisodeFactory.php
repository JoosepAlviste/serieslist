<?php

use App\Models\SeenEpisode;
use Faker\Generator as Faker;

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(SeenEpisode::class, function (Faker $faker) {
    return [
        'user_id' => function () {
            return create(\App\Models\User::class)->id;
        },
        'episode_id' => function () {
            return create(\App\Models\Episode::class)->id;
        },
    ];
});
