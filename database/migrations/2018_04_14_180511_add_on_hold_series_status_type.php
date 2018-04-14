<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddOnHoldSeriesStatusType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \App\Models\SeriesStatusType::where('code', 3)
            ->update(['code' => 4]);

        \App\Models\SeriesStatusType::create([
            'code' => 3,
            'status' => 'on-hold',
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \App\Models\SeriesStatusType::where('code', 3)->delete();

        \App\Models\SeriesStatusType::where('code', 4)
            ->update(['code' => 3]);
    }
}
