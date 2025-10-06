<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Nivo_studijaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('nivo_studija')->insert([
            ['nivo_studija_id'=>'1', 'nivo_studija'=>'Osnovne akademske studije'],
            ['nivo_studija_id'=>'2', 'nivo_studija'=>'Master akademske studije'],
            ['nivo_studija_id'=>'3', 'nivo_studija'=>'Doktorske akademske studije']
        ]);
    }
}
