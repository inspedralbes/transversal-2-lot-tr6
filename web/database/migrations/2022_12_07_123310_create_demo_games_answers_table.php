<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('demo_games_answers', function (Blueprint $table) {
            $table->id();
            $table->string('id_Question');
            $table->string('incorrectAnswers');
            $table->string('correctAnswer');
            $table->foreign('id_Question')->references('id_Question')->on('demo_games')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('demo_games_answers');
    }
};
