<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tip_uloge_korisnika', function (Blueprint $table) {
            $table->increments('id'); 
            $table->string('naziv');  
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tip_uloge_korisnika');
    }
};
