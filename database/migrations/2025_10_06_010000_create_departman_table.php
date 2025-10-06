<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmanTable extends Migration
{
    public function up(): void
    {
        Schema::create('departman', function (Blueprint $table) {
            $table->increments('departman_id');
            $table->string('naziv', 45);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departman');
    }
}
