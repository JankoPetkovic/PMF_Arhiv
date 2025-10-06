<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTipMaterijalaTable extends Migration
{
    public function up(): void
    {
        Schema::create('tip_materijala', function (Blueprint $table) {
            $table->increments('tip_materijala_id');
            $table->string('naziv', 45);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tip_materijala');
    }
}
