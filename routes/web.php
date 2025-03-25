<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\Korisnik;
use Illuminate\Http\Request;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DepartmanController;



Route::get('/', function () {
    return inertia("Home");
});

Route::get('/getDepartmani',[DepartmanController::class, 'sviDepartmani']);

Route::post('/verifikacija', [HomeController::class, 'verifikuj']);