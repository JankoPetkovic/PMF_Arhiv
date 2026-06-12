<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            TipUlogeKorisnikaSeeder::class,
            DepartmanSeeder::class,
            NivoStudijaSeeder::class,
            TipMaterijalaSeeder::class,
            PodtipMaterijalaSeeder::class,
            SmerSeeder::class,
            PredmetSeeder1::class,
            PredmetSeeder2::class,
            PredmetSeeder3::class,
            PredmetSeeder4::class,
            TipKorisnickeAkcijeSeeder::class,
            TipProblemaSeeder::class,
        ]);
    }
}
