<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePodtipMaterijalaTable extends Migration
{
    public function up(): void
    {
        Schema::create('podtip_materijala', function (Blueprint $table) {
            $table->increments('podtip_materijala_id');
            $table->unsignedInteger('tip_materijala_id');
            $table->foreign('tip_materijala_id')
                  ->references('tip_materijala_id')
                  ->on('tip_materijala')
                  ->restrictOnDelete()
                  ->restrictOnUpdate();
            $table->string('naziv', 45);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('podtip_materijala');
    }
}
