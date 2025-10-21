<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

use Illuminate\Http\Request;

use App\Http\Controllers\KontrolerPocetneStranice;
use App\Http\Controllers\KontrolerKorisnika;
use App\Http\Controllers\KontrolerMaterijala;
use App\Http\Controllers\KontrolerPredmeta;
use App\Http\Controllers\KontrolerTipaMaterijala;
use App\Http\Controllers\KontrolerNivoaStudija;
use App\Http\Controllers\KontrolerDepartmana;
use App\Http\Controllers\KontrolerSmerova;
use App\Http\Controllers\KontrolerPodtipovaMaterijala;
use App\Http\Controllers\KontrolerAdminKorisnika;

//Kontroler pocetne stranice
Route::get('/', [KontrolerPocetneStranice::class, 'index'])->name('home');

//Kontroler Korisnika
Route::get('korisnik/registracija', [KontrolerKorisnika::class, 'create'])->name('korisnik.create');
Route::post('korisnik', [KontrolerKorisnika::class, 'store'])->name('korisnik.store');
Route::post('/prijava', [KontrolerKorisnika::class, 'prijava']);
Route::post('/odjava', [KontrolerKorisnika::class, 'odjava']); 
Route::get('/status-verifikacije', [KontrolerKorisnika::class, 'statusVerifikacije']);
Route::post('/posalji-verifikaciju', [KontrolerKorisnika::class, 'posaljiVerifikaciju']);
Route::get('/verifikuj-mejl/{id}',[KontrolerKorisnika::class, 'obradiVerifikaciju'])->name('korisnik.verifikuj');
Route::post('/prijavi-problem', [KontrolerKorisnika::class, 'prijaviProblem']);


//Kontroler Tipova materijala
Route::resource('tipovi-materijala', KontrolerTipaMaterijala::class);

//Kontroler Podtipova materijala
Route::resource('podtipovi-materijala', KontrolerPodtipovaMaterijala::class);
Route::resource('smerovi', KontrolerSmerova::class)->only(['show']);
Route::resource('materijali', KontrolerMaterijala::class)->only(['index']);
Route::resource('departmani', KontrolerDepartmana::class)->only(['index']);
Route::resource('predmeti', KontrolerPredmeta::class)->except(['store']);


//Kontroler Nivoa studija
Route::resource('nivo-studija', KontrolerNivoaStudija::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('korisnik', KontrolerKorisnika::class)->except(['create', 'store']);
    Route::resource('materijali', KontrolerMaterijala::class)->names(['store' => 'materijali.sacuvaj'])->except(['index']);
    Route::post('materijal.prijavi', [KontrolerMaterijala::class, 'prijaviMaterijal']);
    Route::get('export-problema', [KontrolerAdminKorisnika::class, 'exportProblema']);
    Route::get('export-strukture-fakulteta', [KontrolerAdminKorisnika::class, 'exportStrukturaFakulteta']);
    Route::get('export-korisnickih-akcija', [KontrolerAdminKorisnika::class, 'exportKorisnickihAkcija']);

    //Kontroler departmana
    Route::resource('departmani', KontrolerDepartmana::class)->only(['store']);
    //Kontroler Smerova
    Route::resource('smerovi', KontrolerSmerova::class)->except(['show']);

    //Kontroler Predmeta
    Route::resource('predmeti', KontrolerPredmeta::class)->only(['store']);

});

