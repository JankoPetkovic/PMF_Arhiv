<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ServisIzvestaja;
use App\Models\Korisnik;
use App\Models\TipUlogeKorisnika;
use Inertia\Inertia;

class KontrolerAdminKorisnika extends Controller
{
    protected $servisIzvestaja;

    public function __construct(ServisIzvestaja $servisIzvestaja)
    {
        $this->servisIzvestaja = $servisIzvestaja;
    }

    private function jeAdmin(): bool
    {
        /** @var \App\Models\Korisnik|null $korisnik */
        $korisnik = Auth::user();
        return $korisnik && $korisnik->tipUloge && $korisnik->tipUloge->naziv === 'Admin';
    }

    /**
     * Admin kutak: lista korisnika sa ulogama + dostupne uloge za dodelu.
     */
    public function prikaziUpravljanjeUlogama(Request $zahtev)
    {
        if (!$this->jeAdmin()) {
            return redirect('/');
        }

        $pretraga = $zahtev->input('pretraga');

        $korisnici = Korisnik::with('tipUloge')
            ->when($pretraga, function ($upit) use ($pretraga) {
                $upit->where(function ($p) use ($pretraga) {
                    $p->where('ime', 'like', "%{$pretraga}%")
                      ->orWhere('prezime', 'like', "%{$pretraga}%")
                      ->orWhere('email', 'like', "%{$pretraga}%")
                      ->orWhere('broj_indeksa', 'like', "%{$pretraga}%");
                });
            })
            ->orderBy('prezime')
            ->limit(200)
            ->get()
            ->map(fn($k) => [
                'korisnik_id'  => $k->korisnik_id,
                'ime'          => $k->ime,
                'prezime'      => $k->prezime,
                'email'        => $k->email,
                'broj_indeksa' => $k->broj_indeksa,
                'uloga_id'     => $k->tip_uloge_korisnika_id,
                'uloga'        => $k->tipUloge->naziv ?? null,
            ]);

        return Inertia::render('AdminKorisnici', [
            'korisnici' => $korisnici,
            'uloge'     => TipUlogeKorisnika::orderBy('id')->get(['id', 'naziv']),
            'pretraga'  => $pretraga ?? '',
        ]);
    }

    public function dodeliUlogu(Request $zahtev, string $id)
    {
        if (!$this->jeAdmin()) {
            return response()->json(['message' => 'Korisnik nema Admin privilegije'], 403);
        }

        $validirano = $zahtev->validate([
            'tip_uloge_korisnika_id' => ['required', 'integer', 'exists:tip_uloge_korisnika,id'],
        ]);

        $korisnik = Korisnik::find($id);
        if (!$korisnik) {
            return response()->json(['message' => 'Korisnik nije pronađen'], 404);
        }

        $korisnik->tip_uloge_korisnika_id = $validirano['tip_uloge_korisnika_id'];
        $korisnik->save();

        /** @var \App\Models\Korisnik $admin */
        $admin = Auth::user();
        $admin->zabeleziAkcijuKorisnika('Uloga', "Dodeljena uloga {$korisnik->tipUloge->naziv} korisniku {$korisnik->korisnik_id}");

        return response()->json([
            'message' => 'Uloga ažurirana',
            'uloga'   => $korisnik->tipUloge->naziv,
        ], 200);
    }

    public function exportProblema(){
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();

        if($prijavljenKorisnik->tipUloge->naziv === "Admin"){
            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport problema');
            return $this->servisIzvestaja->generisiIzvestajProblema();
        } else {
            return response()->json([
                'message' => 'Korisnik nema Admin privilegije',
            ], 401);
        }
    }

    public function exportStrukturaFakulteta(){
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();

        if($prijavljenKorisnik->tipUloge->naziv === "Admin"){
            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport strukture fakulteta');
            return $this->servisIzvestaja->generisiIzvestajFakulteta();
        } else {
            return response()->json([
                'message' => 'Korisnik nema Admin privilegije',
            ], 401);
        }
    }

    public function exportKorisnickihAkcija(){
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();

        if($prijavljenKorisnik->tipUloge->naziv === "Admin"){
            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Eksport', 'Eksport korisnickih akcija');
            return $this->servisIzvestaja->generisiIzvestajKorisnickihAkcija();
        } else {
            return response()->json([
                'message' => 'Korisnik nema Admin privilegije',
            ], 401);
        }
    }
}
