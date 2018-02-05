<?php

use App\Models\SeriesStatusType;
use Illuminate\Database\Seeder;

class SeriesStatusTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            1 => 'in-progress',
            2 => 'completed',
            3 => 'plan to watch',
        ];

        foreach ($types as $code => $status) {
            SeriesStatusType::create([
                'code' => $code,
                'status' => $status,
            ]);
        }
    }
}
