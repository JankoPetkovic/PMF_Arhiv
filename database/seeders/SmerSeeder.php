<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SmerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('smer')->insert([
            ['smer_id' => 1, 'naziv_smera' => 'Biologija', 'departman_id' => 1, 'nivo_studija_id' => 1],
            ['smer_id' => 2, 'naziv_smera' => 'Biologija (2021)', 'departman_id' => 1, 'nivo_studija_id' => 1],
            ['smer_id' => 3, 'naziv_smera' => 'Biologija', 'departman_id' => 1, 'nivo_studija_id' => 2],
            ['smer_id' => 4, 'naziv_smera' => 'Ekologija i zastita prirode', 'departman_id' => 1, 'nivo_studija_id' => 2],
            ['smer_id' => 5, 'naziv_smera' => 'Biologija (2021)', 'departman_id' => 1, 'nivo_studija_id' => 3],
            ['smer_id' => 6, 'naziv_smera' => 'Ekologija i zastita prirode (2021)', 'departman_id' => 1, 'nivo_studija_id' => 3],
            ['smer_id' => 7, 'naziv_smera' => 'Biologija (2021) - Modul Molekularna biologija i fiziologija', 'departman_id' => 1, 'nivo_studija_id' => 3],
            ['smer_id' => 8, 'naziv_smera' => 'Biologija', 'departman_id' => 1, 'nivo_studija_id' => 3],
            ['smer_id' => 9, 'naziv_smera' => 'Biologija (2021)', 'departman_id' => 1, 'nivo_studija_id' => 3],
            ['smer_id' => 10, 'naziv_smera' => 'Geografija', 'departman_id' => 2, 'nivo_studija_id' => 1],
            ['smer_id' => 11, 'naziv_smera' => 'Geografija (2021)', 'departman_id' => 2, 'nivo_studija_id' => 1],
            ['smer_id' => 12, 'naziv_smera' => 'Geografija', 'departman_id' => 2, 'nivo_studija_id' => 2],
            ['smer_id' => 13, 'naziv_smera' => 'Turizam', 'departman_id' => 2, 'nivo_studija_id' => 2],
            ['smer_id' => 14, 'naziv_smera' => 'Geografija (2021)', 'departman_id' => 2, 'nivo_studija_id' => 3],
            ['smer_id' => 15, 'naziv_smera' => 'Turizam (2021)', 'departman_id' => 2, 'nivo_studija_id' => 3],
            ['smer_id' => 16, 'naziv_smera' => 'Geonauke (2024)', 'departman_id' => 2, 'nivo_studija_id' => 3],
            ['smer_id' => 17, 'naziv_smera' => 'Matematika', 'departman_id' => 3, 'nivo_studija_id' => 1],
            ['smer_id' => 18, 'naziv_smera' => 'Matematika (2021)', 'departman_id' => 3, 'nivo_studija_id' => 1],
            ['smer_id' => 19, 'naziv_smera' => 'Opsta matematika', 'departman_id' => 3, 'nivo_studija_id' => 2],
            ['smer_id' => 20, 'naziv_smera' => 'Verovatnoca, statistika i finansijska matematika', 'departman_id' => 3, 'nivo_studija_id' => 2],
            ['smer_id' => 21, 'naziv_smera' => 'Matematicki modeli u fizici', 'departman_id' => 3, 'nivo_studija_id' => 2],
            ['smer_id' => 22, 'naziv_smera' => 'Matematika (2021) - Modul Opsta matematika', 'departman_id' => 3, 'nivo_studija_id' => 2],
            ['smer_id' => 23, 'naziv_smera' => 'Matematika (2021) - Modul Profesor matematike', 'departman_id' => 3, 'nivo_studija_id' => 2],
            ['smer_id' => 24, 'naziv_smera' => 'Matematika (2021) - Modul Primenjena matematika', 'departman_id' => 3, 'nivo_studija_id' => 2],
            ['smer_id' => 25, 'naziv_smera' => 'Matematika (2021) - Modul Verovatnoca, statistika i finansijska matematika', 'departman_id' => 3, 'nivo_studija_id' => 2],
            ['smer_id' => 26, 'naziv_smera' => 'Matematika', 'departman_id' => 3, 'nivo_studija_id' => 3],
            ['smer_id' => 27, 'naziv_smera' => 'Matematika (2021)', 'departman_id' => 3, 'nivo_studija_id' => 3],
            ['smer_id' => 28, 'naziv_smera' => 'Racunarske nauke', 'departman_id' => 4, 'nivo_studija_id' => 1],
            ['smer_id' => 29, 'naziv_smera' => 'Racunarske nauke (2021)', 'departman_id' => 4, 'nivo_studija_id' => 1],
            ['smer_id' => 30, 'naziv_smera' => 'Razvoj softvera', 'departman_id' => 4, 'nivo_studija_id' => 2],
            ['smer_id' => 31, 'naziv_smera' => 'Upravljanje informacijama', 'departman_id' => 4, 'nivo_studija_id' => 2],
            ['smer_id' => 32, 'naziv_smera' => 'Vestacka inteligencija i masinsko ucenje (2021)', 'departman_id' => 4, 'nivo_studija_id' => 2],
            ['smer_id' => 33, 'naziv_smera' => 'Racunarske nauke (2021) - Modul Razvoj softvera', 'departman_id' => 4, 'nivo_studija_id' => 2],
            ['smer_id' => 34, 'naziv_smera' => 'Racunarske nauke (2021) - Modul Upravljanje informacijama', 'departman_id' => 4, 'nivo_studija_id' => 2],
            ['smer_id' => 35, 'naziv_smera' => 'Racunarske nauke', 'departman_id' => 4, 'nivo_studija_id' => 3],
            ['smer_id' => 36, 'naziv_smera' => 'Racunarske nauke (2021)', 'departman_id' => 4, 'nivo_studija_id' => 3],
            ['smer_id' => 37, 'naziv_smera' => 'Fizika', 'departman_id' => 5, 'nivo_studija_id' => 1],
            ['smer_id' => 38, 'naziv_smera' => 'Fizika (2021)', 'departman_id' => 5, 'nivo_studija_id' => 1],
            ['smer_id' => 39, 'naziv_smera' => 'Opsta fizika', 'departman_id' => 5, 'nivo_studija_id' => 2],
            ['smer_id' => 40, 'naziv_smera' => 'Primenjena fizika', 'departman_id' => 5, 'nivo_studija_id' => 2],
            ['smer_id' => 41, 'naziv_smera' => 'Fizika-informatika', 'departman_id' => 5, 'nivo_studija_id' => 2],
            ['smer_id' => 42, 'naziv_smera' => 'Fizika (2021) - Modul Eksperimentalna i primenjena fizika', 'departman_id' => 5, 'nivo_studija_id' => 2],
            ['smer_id' => 43, 'naziv_smera' => 'Fizika (2021) - Modul Nastava fizike', 'departman_id' => 5, 'nivo_studija_id' => 2],
            ['smer_id' => 44, 'naziv_smera' => 'Fizika (2021) - Modul Teorijska fizika i primene', 'departman_id' => 5, 'nivo_studija_id' => 2],
            ['smer_id' => 45, 'naziv_smera' => 'Fizika', 'departman_id' => 5, 'nivo_studija_id' => 3],
            ['smer_id' => 46, 'naziv_smera' => 'Fizika (2021)', 'departman_id' => 5, 'nivo_studija_id' => 3],
            ['smer_id' => 47, 'naziv_smera' => 'Hemija', 'departman_id' => 6, 'nivo_studija_id' => 1],
            ['smer_id' => 48, 'naziv_smera' => 'Hemija (2021)', 'departman_id' => 6, 'nivo_studija_id' => 1],
            ['smer_id' => 49, 'naziv_smera' => 'Hemija, modul Istrazivanje i razvoj', 'departman_id' => 6, 'nivo_studija_id' => 2],
            ['smer_id' => 50, 'naziv_smera' => 'Hemija, modul Profesor hemije', 'departman_id' => 6, 'nivo_studija_id' => 2],
            ['smer_id' => 51, 'naziv_smera' => 'Primenjena hemija, modul Primenjena hemija', 'departman_id' => 6, 'nivo_studija_id' => 2],
            ['smer_id' => 52, 'naziv_smera' => 'Primenjena hemija, modul Hemija zivotne sredine', 'departman_id' => 6, 'nivo_studija_id' => 2],
            ['smer_id' => 53, 'naziv_smera' => 'Hemija (2021) - Modul Profesor hemije', 'departman_id' => 6, 'nivo_studija_id' => 2],
            ['smer_id' => 54, 'naziv_smera' => 'Hemija (2021) - Modul Istrazivanje', 'departman_id' => 6, 'nivo_studija_id' => 2],
            ['smer_id' => 55, 'naziv_smera' => 'Primenjena hemija sa osnovama menadzmenta (2021)', 'departman_id' => 6, 'nivo_studija_id' => 2],
            ['smer_id' => 56, 'naziv_smera' => 'Hemija', 'departman_id' => 6, 'nivo_studija_id' => 3],
            ['smer_id' => 57, 'naziv_smera' => 'Hemija (2021)', 'departman_id' => 6, 'nivo_studija_id' => 3],
        ]);
    }
}
