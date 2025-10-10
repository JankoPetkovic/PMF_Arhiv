<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\Controller;
use App\Models\Korisnik;
use App\Models\Smer;
use App\Models\Predmet;
use App\Mail\PrijaviProblem;
use Inertia\Inertia;


class KontrolerKorisnika extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Registracija');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $zahtev){
        try {
            $validacija = $zahtev->validate([
                'ime' => 'required|string|max:45',
                'prezime' => 'required|string|max:45',
                'email' => 'required|email|max:45|unique:korisnik,email',
                'sifra' => 'required|string|min:6|confirmed:sifra_potvrda',
                'broj_indeksa' => 'required|string|max:45|unique:korisnik,broj_indeksa',
            ]);

            $korisnik = Korisnik::kreirajKorisnika($validacija);
            $korisnik->zabeleziAkcijuKorisnika('Kreiranje', 'Kreiran korisnik( id: ' . $korisnik->korisnik_id . ', ime: ' . $korisnik->ime . ', prezime: '. $korisnik->prezime . ')');
            Auth::login($korisnik);
            $zahtev->session()->regenerate();
            $korisnik->zabeleziAkcijuKorisnika('Prijavljivanje');
            
            return response()->json($korisnik, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Neispravni podaci.',
                'errors' => $e->errors(),
            ], 422);
        } 
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        /** @var \App\Models\Korisnik $korisnik */
        $korisnik = Auth::user();
        $korisnik?->load('tipUloge');
        if(($korisnik && $korisnik->korisnik_id == $id) || $korisnik?->tipUloge->naziv === 'Admin'){
            $podaciKorisnika = Korisnik::prikaziKorisnika($id);
            $dostupniSmerovi = Smer::all()->toArray();
            $dostupniPredmeti = Predmet::whereIn('smer_id', array_column($podaciKorisnika['smerovi_korisnika'], 'id'))->get()->toArray();
            $podaci = [
                'korisnik' => $podaciKorisnika,
                'dostupniSmerovi' => $dostupniSmerovi,
                'dostupniPredmeti' => $dostupniPredmeti,
            ];
            return Inertia::render("Korisnik", $podaci);
        } else {
            return redirect()->route('home');
        }
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $zahtev, string $id)
    {
        $ulogovanKorisnik = Auth::user();
        if (($ulogovanKorisnik->korisnik_id != $id) || $ulogovanKorisnik?->tipUloge->naziv != 'Admin') {
            abort(403, 'Nemaš dozvolu da menjaš ovog korisnika.');
        }

        $validacija = $zahtev->validate([
            'ime' => 'sometimes|string|max:255',
            'prezime' => 'sometimes|string|max:255',
            'broj_indeksa' => 'sometimes|string|max:50',
            'email' => 'sometimes|string|max:255',
            'tip_uloge_korisnika_id' => 'sometimes|integer',
            'datum_verifikacije' => 'sometimes|string|max:255',
            'godina' => 'sometimes|string|max:255',
            'izabraniSmerovi' => 'sometimes|array',
            'izabraniSmerovi.*' => 'integer|exists:smer,smer_id',
        ]);


        Korisnik::azurirajKorisnika($id, $validacija);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
 
    public function statusVerifikacije(Request $zahtev){
        $korisnickiMejl = $zahtev->get('mejl');
        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();

        if($korisnik){
            return response()->json($korisnik->statusVerifikacije(), 200);
        } else {
            return response()->json([
                'verifikovan' => false,
                'statusVerifikacije' => "Korisnik se ne nalazi u bazi podataka",
            ], 200);
        }
    }

    public function posaljiVerifikaciju(Request $zahtev){
        $korisnickiMejl = $zahtev->input('mejl');
        $korisnik = Korisnik::where('email', $korisnickiMejl)->first();
        if($korisnik){
            $korisnik->posaljiVerifikaciju(); 
        } else {
            $noviKorisnik = new Korisnik();
            $noviKorisnik->email = $korisnickiMejl;
            $noviKorisnik->save();
            $noviKorisnik->posaljiVerifikaciju(); 
        }
        return response()->noContent();
    }

    public function obradiVerifikaciju($id){
        if (!request()->hasValidSignature()) {
            return redirect()->route('home')->with('error', 'Link nije validan ili je istekao.');
        }

        $korisnik = Korisnik::findOrFail($id);

        $korisnik->obradiVerifikaciju();

        $statusVerifikacije = $korisnik->statusVerifikacije();

        if($statusVerifikacije['verifikovan']){
            $korisnik->zabeleziAkcijuKorisnika('verifikacija', 'Korisnik je uspesno verifikovan.');
            return redirect()->route('home')->with('success', "Korisnik uspesno verifikovan!");
        } else {
            return redirect()->route('home')->with('error', 'Greska pri verifikaciji');
        }
    }

    public function prijaviProblem(Request $zahtev){
        $posiljaoc = $zahtev->input('posiljaoc');
        $opisPrijave = $zahtev->input('opisPrijave');

        Mail::to('jankopetkovic@pmf-arhiv.com')->send(new PrijaviProblem($posiljaoc, $opisPrijave));

        return response()->json(['message' => 'Email sent successfully!']);
    }

    public function prijava(Request $zahtev){
        $zahtev->validate([
            'email' => 'required|email',
            'sifra' => 'required|string'
        ]);

        $korisnik = Korisnik::where('email', $zahtev->email)->first();

        if (!$korisnik || !Hash::check($zahtev->sifra, $korisnik->sifra)) {
            return response()->json(['greska' => 'Nevalidni kredencijali'], 401);
        }

        Auth::login($korisnik);
        $zahtev->session()->regenerate();
        $korisnik->zabeleziAkcijuKorisnika('Prijavljivanje');
        return response()->json($korisnik, 201);
    }
    
    public function odjava(Request $zahtev){
        $zahtev->user()->zabeleziAkcijuKorisnika('Odjavljivanje');
        Auth::logout();

        $zahtev->session()->invalidate();
        $zahtev->session()->regenerateToken();

        return redirect()->route('home');
    }
}
