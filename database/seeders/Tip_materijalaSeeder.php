<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Tip_materijalaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tip_materijala')->insert([
            ['tip_materijala_id'=>'1', 'naziv'=>'Ispit'],
            ['tip_materijala_id'=>'2', 'naziv'=>'Teorija'],
            ['tip_materijala_id'=>'3', 'naziv'=>'Vežbe'],
            ['tip_materijala_id'=>'4', 'naziv'=>'Kolokvijum'],
            ['tip_materijala_id'=>'5', 'naziv'=>'Laboratorija']
        ]);
    }
}
