<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DepartmanSeeder::class,
            Nivo_studijaSeeder::class,
            SmerSeeder::class,
            Tip_materijalaSeeder::class,
            KorisnikSeeder::class,
            Podtip_materijalaSeeder::class,
            PredmetSeeder1::class,
            PredmetSeeder2::class,
            PredmetSeeder3::class,
            PredmetSeeder4::class,
        ]);
    }
}
