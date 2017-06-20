<?php

use Illuminate\Database\Seeder;

class SeriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $series = create(\App\Models\Series::class, [], 5);
        foreach ($series as $oneSeries) {
            for ($i = 1; $i <= 5; $i++) {
                $season = create(\App\Models\Season::class, [
                    'series_id' => $oneSeries->id,
                    'number' => $i,
                ]);
                for ($j = 1; $j <= 5; $j++) {
                    create(\App\Models\Episode::class, [
                        'season_id' => $season->id,
                        'number' => $j,
                    ]);
                }
            }
        }
    }
}
