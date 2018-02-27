<?php

use App\Models\SeriesStatus;
use App\Models\SeriesStatusType;
use Faker\Generator as Faker;

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(SeriesStatus::class, function (Faker $faker) {
    return [
        'user_id' => function () {
            return create(\App\Models\User::class)->id;
        },
        'series_id' => function () {
            return create(\App\Models\Series::class)->id;
        },
        'series_status_type_code' => function () {
            return create(\App\Models\SeriesStatusType::class)->code;
        },
    ];
});

/* @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(SeriesStatusType::class, function (Faker $faker) {
    return [
        'code' => function () {
            return SeriesStatusType::all()->count() + 1;
        },
        'status' => $faker->word,
    ];
});
