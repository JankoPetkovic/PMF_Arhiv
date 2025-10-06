<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKorisnikTable extends Migration
{
    public function up(): void
    {
        Schema::create('korisnik', function (Blueprint $table) {
            $table->increments('korisnik_id');
            $table->string('ime', 45);
            $table->string('prezime', 45);
            $table->string('broj_indeksa', 45);
            $table->string('email', 45)->unique();
            $table->date('datum_verifikacije')->nullable()->default(null);
            $table->string('sifra', 225);
            $table->integer('godina')->default(1);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('korisnik');
    }
}
