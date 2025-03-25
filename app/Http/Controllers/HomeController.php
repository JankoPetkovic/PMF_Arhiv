<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Departman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifikacijaKorisnika;

class HomeController extends Controller
{
    public function index()
    {
        $departmani = $this->sviDepartmani();  

        return Inertia::render('Departmani/Index', [
            'departmani' => $departmani,  
        ]);
    }

    public function verifikuj(Request $request)
{
    $request->validate([
        'email' => 'required|max:255',
    ]);

    try {
        Mail::to($request->email)->send(new VerifikacijaKorisnika());

        return response()->json(['message' => 'Mejl je poslat. Proveri tvoje e-sanduče.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Došlo je do greške pri slanju mejla. Pokušajte ponovo.'], 500);
    }
}

    private function sviDepartmani()
    {
        $departmani = (new Departman)->getDepartmani(); 
        return $departmani; 
    }

    
}
