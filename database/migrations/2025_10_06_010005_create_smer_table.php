<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSmerTable extends Migration
{
    public function up(): void
    {
        Schema::create('smer', function (Blueprint $table) {
            $table->increments('smer_id');
            $table->string('naziv_smera', 225);
            $table->unsignedInteger('departman_id');
            $table->unsignedInteger('nivo_studija_id');
            $table->foreign('departman_id')
                  ->references('departman_id')
                  ->on('departman')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
            $table->foreign('nivo_studija_id')
                  ->references('nivo_studija_id')
                  ->on('nivo_studija')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('smer');
    }
}
