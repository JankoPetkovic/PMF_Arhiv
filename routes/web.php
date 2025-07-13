<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

use Illuminate\Http\Request;

use App\Http\Controllers\KontrolerPocetneStranice;
use App\Http\Controllers\DepartmanController;
use App\Http\Controllers\MaterijalController;
use App\Http\Controllers\ObjaviMaterijal;
use App\Http\Controllers\KontrolerKorisnika;
use App\Http\Controllers\KontrolerMaterijala;
use App\Http\Controllers\KontrolerPredmeta;
use App\Http\Controllers\KontrolerTipaMaterijala;
use App\Http\Controllers\KontrolerNivoaStudija;
use App\Http\Controllers\KontrolerDepartmana;
use App\Http\Controllers\KontrolerSmerova;
use App\Http\Controllers\KontrolerPodtipovaMaterijala;

//Kontroler pocetne stranice
Route::get('/', [KontrolerPocetneStranice::class, 'index'])->name('home');

//Kontroler Korisnika
Route::get('/status-verifikacije', [KontrolerKorisnika::class, 'statusVerifikacije']);
Route::post('/posalji-verifikaciju', [KontrolerKorisnika::class, 'posaljiVerifikaciju']);
Route::get('/verifikuj-mejl/{id}',[KontrolerKorisnika::class, 'obradiVerifikaciju'])->name('korisnik.verifikuj');

//Kontroler Materijala 
Route::resource('materijali', KontrolerMaterijala::class)->only(['index', 'store'])->names(['index' => 'materijali.index', 'store' => 'materijali.sacuvaj']);
Route::post('materijal.prijavi', [KontrolerMaterijala::class, 'prijaviMaterijal']);

//Kontroler Predmeta
Route::resource('predmeti', KontrolerPredmeta::class);

//Kontroler Tipova materijala
Route::resource('tipovi-materijala', KontrolerTipaMaterijala::class);

//Kontroler Nivoa studija
Route::resource('nivo-studija', KontrolerNivoaStudija::class);

//Kontroler departmana
Route::resource('departmani', KontrolerDepartmana::class);

//Kontroler Smerova
Route::resource('smerovi', KontrolerSmerova::class);

//Kontroler Podtipova materijala
Route::resource('podtipovi-materijala', KontrolerPodtipovaMaterijala::class);

