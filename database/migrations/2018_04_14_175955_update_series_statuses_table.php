<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateSeriesStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('series_statuses', function (Blueprint $table) {
            $table->dropForeign('series_statuses_series_status_type_code_foreign');
            $table->foreign('series_status_type_code')
                ->references('code')
                ->on('series_status_types')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('series_statuses', function (Blueprint $table) {
            $table->dropForeign('series_statuses_series_status_type_code_foreign');
            $table->foreign('series_status_type_code')
                ->references('code')
                ->on('series_status_types');
        });
    }
}
