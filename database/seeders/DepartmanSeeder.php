<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmanSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('departman')->insert([
            ['departman_id'=>'1', 'naziv'=>'Biologija i Ekologija'],
            ['departman_id'=>'2', 'naziv'=>'Geografija i Turizam'],
            ['departman_id'=>'3', 'naziv'=>'Matematika'],
            ['departman_id'=>'4', 'naziv'=>'Računarske Nauke'],
            ['departman_id'=>'5', 'naziv'=>'Fizika'],
            ['departman_id'=>'6', 'naziv'=>'Hemija']
        ]);
    }
}
