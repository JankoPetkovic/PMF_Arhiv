<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Podtip_materijalaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('podtip_materijala')->insert([
            ['podtip_materijala_id'=>'1', 'tip_materijala_id'=>'1', 'naziv'=>'Januarsko - februarski rok'],
            ['podtip_materijala_id'=>'2', 'tip_materijala_id'=>'1', 'naziv'=>'Aprilski'],
            ['podtip_materijala_id'=>'3', 'tip_materijala_id'=>'1', 'naziv'=>'Junski 1'],
            ['podtip_materijala_id'=>'4', 'tip_materijala_id'=>'1', 'naziv'=>'Junski 2'],
            ['podtip_materijala_id'=>'5', 'tip_materijala_id'=>'1', 'naziv'=>'Septembarski'],
            ['podtip_materijala_id'=>'6', 'tip_materijala_id'=>'1', 'naziv'=>'Oktobarski 1'],
            ['podtip_materijala_id'=>'7', 'tip_materijala_id'=>'1', 'naziv'=>'Oktobarski 2'],
            ['podtip_materijala_id'=>'8', 'tip_materijala_id'=>'1', 'naziv'=>'Decembarski'],
            ['podtip_materijala_id'=>'9', 'tip_materijala_id'=>'2', 'naziv'=>'Teorija'],
            ['podtip_materijala_id'=>'10', 'tip_materijala_id'=>'3', 'naziv'=>'Vežbe'],
            ['podtip_materijala_id'=>'11', 'tip_materijala_id'=>'5', 'naziv'=>'Laboratorija'],
            ['podtip_materijala_id'=>'12', 'tip_materijala_id'=>'5', 'naziv'=>'Domaći'],
            ['podtip_materijala_id'=>'13', 'tip_materijala_id'=>'5', 'naziv'=>'Projekat'],
            ['podtip_materijala_id'=>'14', 'tip_materijala_id'=>'4', 'naziv'=>'1. Kolokvijum'],
            ['podtip_materijala_id'=>'15', 'tip_materijala_id'=>'4', 'naziv'=>'2. Kolokvijum'],
            ['podtip_materijala_id'=>'16', 'tip_materijala_id'=>'4', 'naziv'=>'3. Kolokvijum'],
            ['podtip_materijala_id'=>'17', 'tip_materijala_id'=>'4', 'naziv'=>'4. Kolokvijum'],
            ['podtip_materijala_id'=>'18', 'tip_materijala_id'=>'1', 'naziv'=>'Usmeni Ispit'],
            ['podtip_materijala_id'=>'19', 'tip_materijala_id'=>'5', 'naziv'=>'Lab Test']
        ]);
    }
}
