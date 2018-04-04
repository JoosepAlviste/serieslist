<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSeriesStatusTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \App\Models\SeriesStatusType::where('code', 2)
            ->update(['status' => 'plan-to-watch']);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        \App\Models\SeriesStatusType::where('code', 2)
            ->update(['status' => 'plan to watch']);
    }
}
