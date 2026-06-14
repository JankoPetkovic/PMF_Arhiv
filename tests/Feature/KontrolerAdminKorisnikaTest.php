<?php

namespace Tests\Feature;

use App\Models\Korisnik;
use App\Models\TipUlogeKorisnika;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontrolerAdminKorisnikaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_moze_da_dodeli_ulogu(): void
    {
        $admin = Korisnik::factory()->admin()->create();
        $meta  = Korisnik::factory()->gost()->create();
        $ulogaId = TipUlogeKorisnika::firstOrCreate(['naziv' => 'Predstavnik parlamenta'])->id;

        $this->actingAs($admin)
            ->patchJson("/admin/korisnici/{$meta->korisnik_id}/uloga", ['tip_uloge_korisnika_id' => $ulogaId])
            ->assertStatus(200);

        $this->assertDatabaseHas('korisnik', [
            'korisnik_id'            => $meta->korisnik_id,
            'tip_uloge_korisnika_id' => $ulogaId,
        ]);
    }

    public function test_nije_admin_ne_moze_da_dodeli_ulogu(): void
    {
        $gost = Korisnik::factory()->gost()->create();
        $meta = Korisnik::factory()->gost()->create();
        $ulogaId = TipUlogeKorisnika::firstOrCreate(['naziv' => 'Admin'])->id;

        $this->actingAs($gost)
            ->patchJson("/admin/korisnici/{$meta->korisnik_id}/uloga", ['tip_uloge_korisnika_id' => $ulogaId])
            ->assertStatus(403);
    }
}
