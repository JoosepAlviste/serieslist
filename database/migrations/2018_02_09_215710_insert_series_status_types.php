<?php

use App\Models\SeriesStatusType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InsertSeriesStatusTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $types = [
            1 => 'in-progress',
            2 => 'plan to watch',
            3 => 'completed',
        ];

        foreach ($types as $code => $status) {
            SeriesStatusType::create([
                'code' => $code,
                'status' => $status,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        SeriesStatusType::destroy([1, 2, 3]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
