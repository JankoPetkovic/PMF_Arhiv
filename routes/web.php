<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\Korisnik;
use Illuminate\Http\Request;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DepartmanController;
use App\Http\Controllers\MaterijalController;



Route::get('/', [HomeController::class, 'index']);

Route::get('/smer-{id}', [MaterijalController::class, 'get_predmeti']);

Route::post('/materijali', [MaterijalController::class, 'get_materijal']);

Route::post('/verifikacija', [HomeController::class, 'verifikuj']);