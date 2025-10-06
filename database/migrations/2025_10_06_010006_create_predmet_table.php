<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePredmetTable extends Migration
{
    public function up(): void
    {
        Schema::create('predmet', function (Blueprint $table) {
            $table->increments('predmet_id');
            $table->string('naziv', 255);
            $table->integer('godina');
            $table->unsignedInteger('smer_id')->nullable();
            $table->foreign('smer_id')
                  ->references('smer_id')
                  ->on('smer')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predmet');
    }
}
