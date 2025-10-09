<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

use App\Http\Controllers\Controller;
use App\Models\Korisnik;
use App\Mail\PrijaviProblem;
use App\Models\KorisnickaAkcija;
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
        $podaciKorisnika = Korisnik::prikaziKorisnika($id);
        return Inertia::render("Korisnik", $podaciKorisnika);
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
        //
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

        return response()->json(['poruka' => 'Korisnik odjavljen']);
    }
}
