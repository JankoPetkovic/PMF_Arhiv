<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

use App\Http\Controllers\Controller;
use App\Models\Korisnik;
use App\Models\Smer;
use App\Models\Predmet;
use App\Mail\PrijaviProblem;
use App\Mail\ResetSifre;
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
        if(Auth::check()){
            /** @var \App\Models\Korisnik $prijavljenKorisnik */
            $prijavljenKorisnik = Auth::user();

            if($prijavljenKorisnik->korisnik_id == $id || $prijavljenKorisnik->tipUloge->naziv === 'Admin'){
                $trazeniKorisnik = Korisnik::findOrFail($id);
                $podaciKorisnika = $trazeniKorisnik->prikaziKorisnika();
                $dostupniSmerovi = Smer::all()->toArray();
                $dostupniPredmeti = Predmet::whereIn('smer_id', array_column($podaciKorisnika['smerovi_korisnika'], 'id'))->get()->toArray();
                $podaci = [
                    'korisnik' => $podaciKorisnika,
                    'dostupniSmerovi' => $dostupniSmerovi,
                    'dostupniPredmeti' => $dostupniPredmeti,
                ];
            return Inertia::render("Korisnik", $podaci);
        } 
        }
        else {
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
        $id = intval($id);
        if(Auth::check()){
            $prijavljenKorisnik = Auth::user();
            if (($prijavljenKorisnik->korisnik_id != $id) && $prijavljenKorisnik?->tipUloge->naziv != 'Admin') {
                abort(401, 'Nemaš dozvolu da menjaš ovog korisnika.');
            }
                $validacija = $zahtev->validate([
                'ime' => 'sometimes|string|max:255',
                'prezime' => 'sometimes|string|max:255',
                'broj_indeksa' => 'sometimes|string|max:50',
                'email' => 'sometimes|string|max:255',
                'sifra' => 'sometimes|string|min:6|confirmed:sifra_potvrda',
                'tip_uloge_korisnika_id' => 'sometimes|integer',
                'datum_verifikacije' => 'sometimes|string|max:255',
                'godina' => 'sometimes|string|max:255',
                'izabraniSmerovi' => 'sometimes|array',
                'izabraniSmerovi.*' => 'integer|exists:smer,smer_id',
            ]);

            $korisnik = Korisnik::findOrFail($id);
            $korisnik->azurirajKorisnika($validacija);
        } else {
            return response()->json([
                'message' => 'Korisnik nije prijavljen',
            ], 401);
        }
        

        
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

        $korisnik->azurirajKorisnika(['datum_verifikacije' => Carbon::now()]);

        $statusVerifikacije = $korisnik->statusVerifikacije();

        if($statusVerifikacije['verifikovan']){
            $korisnik->zabeleziAkcijuKorisnika('Verifikacija', 'Korisnik je uspesno verifikovan.');
            return redirect()->route('home')->with('success', "Korisnik uspesno verifikovan!");
        } else {
            return redirect()->route('home')->with('error', 'Greska pri verifikaciji');
        }
    }

    public function prijaviProblem(Request $zahtev){
        if(Auth::check()){
            $prijavljenKorisnik = Auth::user();
            $opisPrijave = $zahtev->input('opisPrijave');

            Mail::to('jankopetkovic@pmf-arhiv.com')->send(new PrijaviProblem($prijavljenKorisnik->email, $opisPrijave));

            return response()->json(['message' => 'Email sent successfully!']);
        } else {
            return response()->json([
                'message' => 'Korisnik nije prijavljen',
            ], 401);
        }
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
    
    public function zatraziResetSifre(Request $zahtev)
    {
        $zahtev->validate(['email' => 'required|email']);

        $korisnik = Korisnik::where('email', $zahtev->email)->first();

        // Uvek vraćamo isti odgovor bez obzira da li korisnik postoji (sprečava enumeraciju korisnika)
        if (!$korisnik) {
            return response()->json(['message' => 'Ako nalog postoji, email je poslat.'], 200);
        }

        // Brisanje svih starih tokena za ovaj email
        DB::table('password_reset_tokens')->where('email', $zahtev->email)->delete();

        $token = Str::random(64);

        DB::table('password_reset_tokens')->insert([
            'email' => $zahtev->email,
            'token' => hash('sha256', $token),
            'created_at' => Carbon::now(),
        ]);

        $resetUrl = url('/reset-sifre/' . $token . '?email=' . urlencode($zahtev->email));

        try {
            Mail::to($zahtev->email)->send(new ResetSifre($zahtev->email, $resetUrl));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Greška pri slanju emaila.'], 500);
        }

        return response()->json(['message' => 'Ako nalog postoji, email je poslat.'], 200);
    }

    public function prikaziFormResetSifre(Request $zahtev, string $token)
    {
        return Inertia::render('ResetSifre', [
            'token' => $token,
            'email' => $zahtev->query('email', ''),
        ]);
    }

    public function resetujSifru(Request $zahtev)
    {
        $zahtev->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'sifra' => 'required|string|min:6|confirmed:sifra_potvrda',
        ]);

        $zapis = DB::table('password_reset_tokens')
            ->where('email', $zahtev->email)
            ->first();

        if (!$zapis || !hash_equals($zapis->token, hash('sha256', $zahtev->token))) {
            return response()->json(['message' => 'Token nije validan.'], 422);
        }

        if (Carbon::parse($zapis->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $zahtev->email)->delete();
            return response()->json(['message' => 'Token je istekao. Zatražite novi email.'], 422);
        }

        $korisnik = Korisnik::where('email', $zahtev->email)->first();

        if (!$korisnik) {
            return response()->json(['message' => 'Korisnik nije pronađen.'], 404);
        }

        $korisnik->sifra = Hash::make($zahtev->sifra);
        $korisnik->save();

        DB::table('password_reset_tokens')->where('email', $zahtev->email)->delete();

        $korisnik->zabeleziAkcijuKorisnika('Reset šifre', 'Korisnik je resetovao šifru.');

        return response()->json(['message' => 'Šifra je uspešno promenjena.'], 200);
    }

    public function odjava(Request $zahtev){
        $zahtev->user()->zabeleziAkcijuKorisnika('Odjavljivanje');
        Auth::logout();

        $zahtev->session()->invalidate();
        $zahtev->session()->regenerateToken();

        return redirect()->route('home');
    }
}
