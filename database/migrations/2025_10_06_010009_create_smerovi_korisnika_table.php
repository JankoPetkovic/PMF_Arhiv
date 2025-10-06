<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSmeroviKorisnikaTable extends Migration
{
    public function up(): void
    {
        Schema::create('smerovi_korisnika', function (Blueprint $table) {
            $table->unsignedInteger('smer_id');
            $table->unsignedInteger('korisnik_id');
            $table->primary(['smer_id', 'korisnik_id']);
            $table->foreign('smer_id')
                  ->references('smer_id')
                  ->on('smer')
                  ->restrictOnDelete()
                  ->restrictOnUpdate();
            $table->foreign('korisnik_id')
                  ->references('korisnik_id')
                  ->on('korisnik')
                  ->restrictOnDelete()
                  ->restrictOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('smerovi_korisnika');
    }
}
