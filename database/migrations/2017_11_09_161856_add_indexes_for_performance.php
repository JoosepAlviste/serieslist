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
        Schema::table('seen_episodes', function (Blueprint $table) {
            $table->dropForeign(['episode_id', 'user_id']);
        });
    }
}
