<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Departman;
use Inertia\Inertia;

class DepartmanController extends Controller
{

    public function index()
    {
        $departmani = $this->sviDepartmani();  

        return Inertia::render('Departmani/Index', [
            'departmani' => $departmani,  
        ]);
    }

    private function sviDepartmani()
    {
        $departmani = (new Departman)->getDepartmani(); 
        return $departmani; 
    }

    public function store(Request $request)
    {
        // Validacija unetih podataka
        $request->validate([
            'naziv' => 'required|string|max:255',
        ]);

        // Kreiranje novog departmana u bazi
        $departman = Departman::create([
            'naziv' => $request->naziv,
        ]);

        // Nakon dodavanja, možemo poslati podatke nazad
        return response()->json([
            'message' => 'Departman uspešno dodat!',
            'departman' => $departman,
        ]);
    }
}
