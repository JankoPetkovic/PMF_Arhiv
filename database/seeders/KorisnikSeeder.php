<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; 

class KorisnikSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('korisnik')->insert([
            [
                'korisnik_id'=>'1', 
                'ime'=>'Janko', 
                'prezime'=>'Petkovic', 
                'broj_indeksa'=>'530', 
                'email'=>'janko.petkovic@pmf.edu.rs', 
                'datum_verifikacije'=>'2025-09-09', 
                'sifra'=>Hash::make('Janko0310*'), 
                'godina'=>'1',
                'tip_uloge_korisnika_id'=>'2',
            ],
        ]);
    }
}
