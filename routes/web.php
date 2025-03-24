<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\Korisnik;
use Illuminate\Http\Request;



Route::get('/', function () {
    return inertia("Home");
});

Route::get('/verifikacija/{token}', function ($token) {
    // Pronalazak korisnika po tokenu
    $podaci = DB::table('verifikacija_tokeni')->where('token', $token)->first();

    if (!$podaci) {
        return abort(404, 'Token nije validan.');
    }

    // Ažuriranje korisnika
    $korisnik = Korisnik::find($podaci->korisnik_id);
    $korisnik->verifikovan = true;
    $korisnik->datum_verifikacije = now();
    $korisnik->save();

    // Brisanje tokena iz baze
    DB::table('verifikacija_tokeni')->where('token', $token)->delete();

    return redirect('/login')->with('success', 'Uspešno ste verifikovali nalog.');
});

Route::post('/verifikuj-korisnika', function (Request $request) {
    $email = $request->input('email'); // Preuzimanje e-maila iz POST zahteva

    // Provera da li je email prisutan
    if (!$email) {
        return response()->json(['message' => 'Email adresa je obavezna.'], 400);
    }

    // Provera da li korisnik postoji u bazi
    $korisnik = Korisnik::where('email', $email)->first();

    // Ako korisnik postoji
    if ($korisnik) {
        // Ako je korisnik već verifikovan
        if ($korisnik->verifikovan) {
            return response()->json(['message' => 'Korisnik je već verifikovan.'], 200);
        }
    } else {
        // Ako korisnik ne postoji, kreiraj ga
        $korisnik = Korisnik::create([
            'email' => $email,
            'verifikovan' => false,
            'datum_verifikacije' => null,
        ]);
    }

    // Generisanje tokena za verifikaciju
    $token = Str::random(60);

    // Upisivanje tokena u tabelu (možeš napraviti posebnu tabelu za token ili koristiti već postojeću)
    DB::table('verifikacija_tokeni')->updateOrInsert(
        ['korisnik_id' => $korisnik->korisnik_id],
        ['token' => $token, 'created_at' => now()]
    );

    // Slanje e-maila sa verifikacionim linkom
    $verifikacijaLink = route('verifikacija.potvrdi', ['token' => $token]); // Ruta za potvrdu
    Mail::to($email)->send(new VerifikacijaKorisnika($verifikacijaLink));

    return response()->json(['message' => 'E-mail za verifikaciju je poslat.'], 200);
});