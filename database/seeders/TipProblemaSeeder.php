<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipProblemaSeeder extends Seeder
{

    public function run(): void
    {
        DB::table('tip_problema')->insert([
            ['naziv' => 'Nevalidan materijal'],
            ['naziv' => 'Korisnički problem'],
            ['naziv' => 'Serverski problem'],
        ]);
    }
}
