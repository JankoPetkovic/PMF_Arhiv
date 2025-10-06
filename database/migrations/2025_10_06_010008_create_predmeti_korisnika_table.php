<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePredmetiKorisnikaTable extends Migration
{
    public function up(): void
    {
        Schema::create('predmeti_korisnika', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('korisnik_id');
            $table->unsignedInteger('predmet_id');
            $table->foreign('korisnik_id')
                  ->references('korisnik_id')
                  ->on('korisnik')
                  ->cascadeOnDelete();
            $table->foreign('predmet_id')
                  ->references('predmet_id')
                  ->on('predmet')
                  ->cascadeOnDelete();
            $table->unique(['korisnik_id', 'predmet_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predmeti_korisnika');
    }
}
