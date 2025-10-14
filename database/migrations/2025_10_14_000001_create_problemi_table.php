<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('problemi', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('korisnik_id')->unsigned();
            $table->integer('tip_problema_id')->unsigned();
            $table->string('poruka')->nullable();
            $table->timestamp('vreme_upisa')->useCurrent();

            $table->foreign('korisnik_id')
                ->references('korisnik_id')
                ->on('korisnik')
                ->onDelete('cascade');

            $table->foreign('tip_problema_id')
                ->references('id')
                ->on('tip_problema')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('korisnicke_akcije');
    }
};
