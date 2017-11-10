<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndexesForPerformance extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->index('number');
            $table->foreign('season_id')->references('id')->on('seasons');
        });

        Schema::table('seasons', function (Blueprint $table) {
            $table->index('number');
            $table->foreign('series_id')->references('id')->on('series');
        });

        Schema::table('seen_episodes', function (Blueprint $table) {
            $table->foreign('episode_id')->references('id')->on('episodes');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->dropIndex(['number']);
            $table->dropForeign(['season_id']);
        });

        Schema::table('seasons', function (Blueprint $table) {
            $table->dropIndex(['number']);
            $table->dropForeign(['series_id']);
        });

        Schema::table('seen_episodes', function (Blueprint $table) {
            $table->dropForeign(['episode_id', 'user_id']);
        });
    }
}
