<?php

namespace Tests\Feature;

use App\Models\Materijal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class KontrolerMaterijalaEksportTest extends TestCase
{
    use RefreshDatabase;

    public function test_eksport_vraca_404_kada_nema_materijala(): void
    {
        Storage::fake('public');

        $this->get(route('materijali.eksport'))->assertNotFound();
    }

    public function test_eksport_vraca_zip_kada_materijali_postoje(): void
    {
        Storage::fake('public');

        $materijal = Materijal::factory()->create();
        Storage::disk('public')->put($materijal->vratiPutanju(), 'sadrzaj');

        $odgovor = $this->get(route('materijali.eksport'));

        $odgovor->assertOk();
        $odgovor->assertDownload();
    }
}
