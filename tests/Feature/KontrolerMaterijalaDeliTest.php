<?php

namespace Tests\Feature;

use App\Models\Materijal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class KontrolerMaterijalaDeliTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Kreira materijal čiji fajl realno postoji na fake public disku,
     * na putanji koju vraća Materijal::vratiPutanju().
     */
    private function materijalSaFajlom(): Materijal
    {
        $materijal = Materijal::factory()->create();

        // Putanja koju kontroler koristi za serviranje fajla
        Storage::disk('public')->put($materijal->vratiPutanju(), 'sadrzaj fajla');

        return $materijal;
    }

    public function test_deli_vraca_200_i_servira_fajl_za_postojeci_materijal(): void
    {
        Storage::fake('public');

        $materijal = $this->materijalSaFajlom();

        $odgovor = $this->get(route('materijali.deli', [
            'id'   => $materijal->materijal_id,
            'slug' => 'neki-naziv',
        ]));

        $odgovor->assertOk();
    }

    public function test_deli_vraca_404_za_nepostojeci_id(): void
    {
        Storage::fake('public');

        $odgovor = $this->get(route('materijali.deli', [
            'id'   => 999999,
            'slug' => 'bilo-sta',
        ]));

        $odgovor->assertNotFound();
    }

    public function test_deli_ignorise_slug_radi_i_sa_pogresnim_slugom(): void
    {
        Storage::fake('public');

        $materijal = $this->materijalSaFajlom();

        $saPogresnimSlugom = $this->get(route('materijali.deli', [
            'id'   => $materijal->materijal_id,
            'slug' => 'totalno-pogresan-slug',
        ]));
        $saPogresnimSlugom->assertOk();

        // Radi i bez sluga uopšte
        $bezSluga = $this->get(route('materijali.deli', [
            'id' => $materijal->materijal_id,
        ]));
        $bezSluga->assertOk();
    }
}
