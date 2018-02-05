<?php

use App\Models\SeriesStatusType;
use Illuminate\Database\Seeder;

class ProductionDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (SeriesStatusType::all()->isEmpty()) {
            $this->call(SeriesStatusTypesTableSeeder::class);
        }
    }
}
