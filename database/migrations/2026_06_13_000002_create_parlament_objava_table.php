<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateParlamentObjavaTable extends Migration
{
    public function up(): void
    {
        Schema::create('parlament_objava', function (Blueprint $table) {
            $table->increments('parlament_objava_id');
            $table->string('naslov');
            $table->text('sadrzaj')->nullable();
            $table->string('slika')->nullable();   // putanja do slike na public disku
            $table->string('link')->nullable();
            $table->unsignedInteger('korisnik_id'); // autor objave
            $table->timestamp('datum_objave')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('datum_izmene')->nullable();
            $table->timestamp('datum_brisanja')->nullable();
            $table->foreign('korisnik_id')
                  ->references('korisnik_id')
                  ->on('korisnik')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parlament_objava');
    }
}
