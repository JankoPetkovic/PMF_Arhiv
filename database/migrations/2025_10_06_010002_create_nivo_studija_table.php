<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNivoStudijaTable extends Migration
{
    public function up(): void
    {
        Schema::create('nivo_studija', function (Blueprint $table) {
            $table->increments('nivo_studija_id');
            $table->string('nivo_studija', 45);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nivo_studija');
    }
}
