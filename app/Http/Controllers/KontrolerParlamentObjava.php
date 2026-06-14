<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ParlamentObjava;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class KontrolerParlamentObjava extends Controller
{
    private const ULOGA = 'Predstavnik parlamenta';

    private function jePredstavnik(): bool
    {
        /** @var \App\Models\Korisnik|null $korisnik */
        $korisnik = Auth::user();
        // Admin je superuser — može sve što i predstavnik parlamenta.
        return $korisnik && $korisnik->tipUloge
            && in_array($korisnik->tipUloge->naziv, [self::ULOGA, 'Admin'], true);
    }

    /**
     * Lista objava + stranica za upravljanje (kreiranje/izmena/brisanje za predstavnike).
     */
    public function index(Request $zahtev)
    {
        $stranica = max(1, (int) $zahtev->input('stranica', 1));

        $p = ParlamentObjava::with(['autor', 'anketa.pitanja.opcije'])
            ->orderByDesc('datum_objave')
            ->paginate(10, ['*'], 'stranica', $stranica);

        return Inertia::render('ParlamentObjave', [
            'objave'        => collect($p->items())->map(fn($o) => $o->zaPrikaz())->values(),
            'mozeUpravljati' => $this->jePredstavnik(),
            'paginacija'    => [
                'trenutna' => $p->currentPage(),
                'ukupno'   => $p->lastPage(),
            ],
        ]);
    }

    public function store(Request $zahtev)
    {
        if (!$this->jePredstavnik()) {
            return response()->json(['message' => 'Samo predstavnik parlamenta može da objavljuje'], 403);
        }

        $validirano = $zahtev->validate([
            'naslov'  => ['required', 'string', 'max:255'],
            'sadrzaj' => ['nullable', 'string'],
            'link'    => ['nullable', 'url', 'max:2048'],
            'slika'   => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // do 5 MB, bez SVG
        ]);

        $putanjaSlike = null;
        if ($zahtev->hasFile('slika')) {
            $putanjaSlike = $zahtev->file('slika')->store('parlament', 'public');
        }

        /** @var \App\Models\Korisnik $korisnik */
        $korisnik = Auth::user();

        $objava = ParlamentObjava::create([
            'naslov'      => $validirano['naslov'],
            'sadrzaj'     => $validirano['sadrzaj'] ?? null,
            'link'        => $validirano['link'] ?? null,
            'slika'       => $putanjaSlike,
            'korisnik_id' => $korisnik->korisnik_id,
        ]);

        $korisnik->zabeleziAkcijuKorisnika('Kreiranje', "Kreirana objava parlamenta: {$objava->parlament_objava_id}");

        return response()->json(['message' => 'Objava kreirana', 'objava' => $objava->fresh()->zaPrikaz()], 201);
    }

    public function update(Request $zahtev, string $id)
    {
        if (!$this->jePredstavnik()) {
            return response()->json(['message' => 'Samo predstavnik parlamenta može da menja objave'], 403);
        }

        $objava = ParlamentObjava::find($id);
        if (!$objava) {
            return response()->json(['message' => 'Objava nije pronađena'], 404);
        }

        $validirano = $zahtev->validate([
            'naslov'       => ['required', 'string', 'max:255'],
            'sadrzaj'      => ['nullable', 'string'],
            'link'         => ['nullable', 'url', 'max:2048'],
            'slika'        => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'ukloni_sliku' => ['sometimes', 'boolean'],
        ]);

        $objava->naslov  = $validirano['naslov'];
        $objava->sadrzaj = $validirano['sadrzaj'] ?? null;
        $objava->link    = $validirano['link'] ?? null;

        // Zamena ili uklanjanje slike
        if ($zahtev->hasFile('slika')) {
            if ($objava->slika) {
                Storage::disk('public')->delete($objava->slika);
            }
            $objava->slika = $zahtev->file('slika')->store('parlament', 'public');
        } elseif (!empty($validirano['ukloni_sliku']) && $objava->slika) {
            Storage::disk('public')->delete($objava->slika);
            $objava->slika = null;
        }

        $objava->save();

        /** @var \App\Models\Korisnik $korisnik */
        $korisnik = Auth::user();
        $korisnik->zabeleziAkcijuKorisnika('Ažuriranje', "Izmenjena objava parlamenta: {$objava->parlament_objava_id}");

        return response()->json(['message' => 'Objava ažurirana', 'objava' => $objava->fresh()->zaPrikaz()], 200);
    }

    public function destroy(string $id)
    {
        if (!$this->jePredstavnik()) {
            return response()->json(['message' => 'Samo predstavnik parlamenta može da briše objave'], 403);
        }

        $objava = ParlamentObjava::find($id);
        if (!$objava) {
            return response()->json(['message' => 'Objava nije pronađena'], 404);
        }

        $objava->delete(); // soft delete — slika ostaje za eventualni restore

        /** @var \App\Models\Korisnik $korisnik */
        $korisnik = Auth::user();
        $korisnik->zabeleziAkcijuKorisnika('Brisanje', "Obrisana objava parlamenta: {$id}");

        return response()->json(['message' => 'Objava obrisana'], 200);
    }
}
