<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\Korisnik;
use Illuminate\Http\Request;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DepartmanController;
use App\Http\Controllers\MaterijalController;
use App\Http\Controllers\ObjaviMaterijal;
use App\Http\Controllers\MailController;
use Illuminate\Support\Carbon;

use App\Mail\PrijaviMaterijal;



Route::get('/', [HomeController::class, 'index']);

Route::get('/smer-{id}', [MaterijalController::class, 'get_predmeti']);
Route::post('kreiraj-materijal', [MaterijalController::class, 'storeMaterijal']);
Route::post('/materijali', [MaterijalController::class, 'get_materijal']);

Route::get('/objavi-materijal', [ObjaviMaterijal::class, 'objaviMaterijalHome']);
Route::post('/get-smerovi', [ObjaviMaterijal::class, 'getSmerovi']);
Route::post('/get-predmeti', [ObjaviMaterijal::class, 'getPredmeti']);
Route::post('/get-podTipovi', [ObjaviMaterijal::class, 'getPodTipoviMaterijala']);

Route::post('/prijavaMaterijala', [MailController::class, 'prijaviMaterijal']);
Route::post('/verifikujJanka', [MailController::class, 'posaljiVerifikaciju']);
Route::get('/verifikuj-mejl/{id}',[MailController::class, 'obradiVerifikaciju'])->name('verifikuj.mejl');
