<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateMaterijalTable extends Migration
{
    public function up(): void
    {
        Schema::create('materijal', function (Blueprint $table) {
            $table->increments('materijal_id');
            $table->string('naziv');
            $table->unsignedInteger('predmet_id');
            $table->unsignedInteger('podtip_materijala_id');
            $table->string('skolska_godina', 45);
            $table->unsignedInteger('korisnik_id');
            $table->timestamp('datum_dodavanja')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('datum_brisanja')->nullable();
            $table->foreign('predmet_id')
                  ->references('predmet_id')
                  ->on('predmet')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
            $table->foreign('podtip_materijala_id')
                  ->references('podtip_materijala_id')
                  ->on('podtip_materijala')
                  ->restrictOnDelete()
                  ->restrictOnUpdate();
            $table->foreign('korisnik_id')
                  ->references('korisnik_id')
                  ->on('korisnik')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materijal');
    }
}
