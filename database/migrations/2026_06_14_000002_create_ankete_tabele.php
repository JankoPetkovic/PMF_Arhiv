<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Anketa (poll) — jedna po objavi parlamenta.
        Schema::create('anketa', function (Blueprint $table) {
            $table->increments('anketa_id');
            $table->unsignedInteger('parlament_objava_id')->unique();
            $table->string('naslov')->nullable();
            $table->timestamp('rok_trajanja')->nullable(); // null = bez roka
            $table->timestamp('datum_kreiranja')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->foreign('parlament_objava_id')
                  ->references('parlament_objava_id')->on('parlament_objava')
                  ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // Pitanje u anketi.
        Schema::create('anketa_pitanje', function (Blueprint $table) {
            $table->increments('pitanje_id');
            $table->unsignedInteger('anketa_id');
            $table->string('tekst');
            $table->enum('tip', ['jednostruki', 'visestruki', 'slobodan'])->default('jednostruki');
            $table->boolean('dozvoli_drugo')->default(false); // "Drugo: ___" uz ponuđene
            $table->boolean('obavezno')->default(true);
            $table->integer('redosled')->default(0);
            $table->foreign('anketa_id')
                  ->references('anketa_id')->on('anketa')
                  ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // Ponuđena opcija za pitanje (choice tipovi).
        Schema::create('anketa_opcija', function (Blueprint $table) {
            $table->increments('opcija_id');
            $table->unsignedInteger('pitanje_id');
            $table->string('tekst');
            $table->integer('redosled')->default(0);
            $table->foreign('pitanje_id')
                  ->references('pitanje_id')->on('anketa_pitanje')
                  ->cascadeOnDelete()->cascadeOnUpdate();
        });

        // Jedna popunjena forma (jedan ispitanik) + identitet.
        Schema::create('anketa_odgovor', function (Blueprint $table) {
            $table->increments('odgovor_id');
            $table->unsignedInteger('anketa_id');
            $table->unsignedInteger('korisnik_id')->nullable();
            $table->string('ime', 100);
            $table->string('prezime', 100);
            $table->string('email', 150);
            $table->string('broj_indeksa', 50)->nullable();
            $table->timestamp('vreme_odgovora')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->unique(['anketa_id', 'email']); // sprečava duple glasove po emailu
            $table->foreign('anketa_id')
                  ->references('anketa_id')->on('anketa')
                  ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('korisnik_id')
                  ->references('korisnik_id')->on('korisnik')
                  ->nullOnDelete()->cascadeOnUpdate();
        });

        // Pojedinačni odgovor na svako pitanje unutar forme.
        Schema::create('anketa_odgovor_stavka', function (Blueprint $table) {
            $table->increments('stavka_id');
            $table->unsignedInteger('odgovor_id');
            $table->unsignedInteger('pitanje_id');
            $table->unsignedInteger('opcija_id')->nullable(); // izabrana opcija (choice)
            $table->text('slobodan_tekst')->nullable();        // slobodan unos / "Drugo"
            $table->foreign('odgovor_id')
                  ->references('odgovor_id')->on('anketa_odgovor')
                  ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('pitanje_id')
                  ->references('pitanje_id')->on('anketa_pitanje')
                  ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('opcija_id')
                  ->references('opcija_id')->on('anketa_opcija')
                  ->nullOnDelete()->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anketa_odgovor_stavka');
        Schema::dropIfExists('anketa_odgovor');
        Schema::dropIfExists('anketa_opcija');
        Schema::dropIfExists('anketa_pitanje');
        Schema::dropIfExists('anketa');
    }
};
