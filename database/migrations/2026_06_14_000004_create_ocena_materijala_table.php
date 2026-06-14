<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ocena_materijala', function (Blueprint $table) {
            $table->increments('ocena_id');
            $table->unsignedInteger('materijal_id');
            $table->unsignedInteger('korisnik_id');
            $table->unsignedTinyInteger('ocena'); // 1–5
            $table->timestamp('datum')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->unique(['materijal_id', 'korisnik_id']); // jedan korisnik = jedna ocena po materijalu
            $table->foreign('materijal_id')
                  ->references('materijal_id')->on('materijal')
                  ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('korisnik_id')
                  ->references('korisnik_id')->on('korisnik')
                  ->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ocena_materijala');
    }
};
