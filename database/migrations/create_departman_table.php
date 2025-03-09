<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDepartmanTable extends Migration
{
    public function up()
    {
        Schema::create('departman', function (Blueprint $table) {
            $table->id('departman_id')->unsigned();
            $table->string('naziv', 45);
            $table->primary('departman_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('departman');
    }
}
