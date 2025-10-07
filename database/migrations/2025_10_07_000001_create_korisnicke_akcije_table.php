<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('korisnicke_akcije', function (Blueprint $table) {
            $table->id(); // id kolona je i dalje bigint auto increment
            // Ako želiš, možeš promeniti i id u int: $table->increments('id');

            $table->integer('korisnik_id')->unsigned();
            $table->integer('tip_korisnicke_akcije_id')->unsigned();
            $table->string('poruka')->nullable();
            $table->timestamp('vreme_akcije')->useCurrent();

            // Strani ključevi
            $table->foreign('korisnik_id')
                ->references('korisnik_id')
                ->on('korisnik')
                ->onDelete('cascade');

            $table->foreign('tip_korisnicke_akcije_id')
                ->references('id')
                ->on('tip_korisnicke_akcije')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('korisnicke_akcije');
    }
};
