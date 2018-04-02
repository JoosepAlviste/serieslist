<?php

use App\Models\SeriesProgress;
use Faker\Generator as Faker;

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(SeriesProgress::class, function (Faker $faker) {
    // Since we cannot easily use the latest seen episode and series values
    // while generating other columns, we just don't add those here.
    // At least latest_seen_episode_id has to be overridden when using this
    // factory.
    return [
        'user_id' => function () {
            return create(\App\Models\User::class)->id;
        },
        'series_id' => function () {
            return create(\App\Models\Series::class)->id;
        },
        'latest_seen_episode_id' => null,
        'next_episode_id' => null,
    ];
});
