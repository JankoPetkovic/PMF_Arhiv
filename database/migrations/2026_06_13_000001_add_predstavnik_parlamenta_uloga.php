<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Nova uloga: predstavnik studentskog parlamenta (može da upravlja objavama).
        DB::table('tip_uloge_korisnika')->updateOrInsert(
            ['id' => 4],
            ['naziv' => 'Predstavnik parlamenta']
        );
    }

    public function down(): void
    {
        DB::table('tip_uloge_korisnika')->where('id', 4)->delete();
    }
};
