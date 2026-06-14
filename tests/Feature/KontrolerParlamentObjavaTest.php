<?php

namespace Tests\Feature;

use App\Models\Korisnik;
use App\Models\ParlamentObjava;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KontrolerParlamentObjavaTest extends TestCase
{
    use RefreshDatabase;

    public function test_javni_pregled_objava_vraca_200(): void
    {
        ParlamentObjava::factory()->count(2)->create();

        $this->get('/parlament')->assertStatus(200);
    }

    public function test_predstavnik_moze_da_kreira_objavu(): void
    {
        // Tipovi akcija dolaze iz seedera (ne migracije) — potrebni za beleženje akcije.
        $this->seed(\Database\Seeders\TipKorisnickeAkcijeSeeder::class);

        $predstavnik = Korisnik::factory()->predstavnik()->create();

        $odgovor = $this->actingAs($predstavnik)->postJson('/parlament', [
            'naslov'  => 'Važno obaveštenje',
            'sadrzaj' => 'Tekst objave.',
        ]);

        $odgovor->assertStatus(201);
        $this->assertDatabaseHas('parlament_objava', ['naslov' => 'Važno obaveštenje']);
        // Akcija je zabeležena
        $this->assertDatabaseHas('korisnicke_akcije', ['korisnik_id' => $predstavnik->korisnik_id]);
    }

    public function test_admin_takodje_moze_da_upravlja_objavama(): void
    {
        $this->seed(\Database\Seeders\TipKorisnickeAkcijeSeeder::class);
        $admin = Korisnik::factory()->admin()->create();

        $this->actingAs($admin)->postJson('/parlament', [
            'naslov'  => 'Admin objava',
            'sadrzaj' => 'Tekst.',
        ])->assertStatus(201);

        $this->assertDatabaseHas('parlament_objava', ['naslov' => 'Admin objava']);
    }

    public function test_obican_korisnik_ne_moze_da_kreira_objavu(): void
    {
        $gost = Korisnik::factory()->gost()->create();

        $this->actingAs($gost)->postJson('/parlament', [
            'naslov' => 'Pokušaj',
        ])->assertStatus(403);

        $this->assertDatabaseMissing('parlament_objava', ['naslov' => 'Pokušaj']);
    }

    public function test_predstavnik_moze_da_izmeni_i_obrise_objavu(): void
    {
        $predstavnik = Korisnik::factory()->predstavnik()->create();
        $objava = ParlamentObjava::factory()->create();

        $this->actingAs($predstavnik)->post("/parlament/{$objava->parlament_objava_id}", [
            'naslov' => 'Izmenjen naslov',
        ])->assertStatus(200);

        $this->assertDatabaseHas('parlament_objava', ['naslov' => 'Izmenjen naslov']);

        $this->actingAs($predstavnik)
            ->deleteJson("/parlament/{$objava->parlament_objava_id}")
            ->assertStatus(200);

        $this->assertSoftDeleted('parlament_objava', ['parlament_objava_id' => $objava->parlament_objava_id]);
    }

    public function test_obican_korisnik_ne_moze_da_obrise_objavu(): void
    {
        $gost = Korisnik::factory()->gost()->create();
        $objava = ParlamentObjava::factory()->create();

        $this->actingAs($gost)
            ->deleteJson("/parlament/{$objava->parlament_objava_id}")
            ->assertStatus(403);
    }
}
