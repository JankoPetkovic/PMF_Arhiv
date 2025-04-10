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
        $departmani = Departman::all();  

        return Inertia::render('Home', [
            'departmani' => $departmani,  
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'naziv' => 'required|string|max:255',
        ]);

        $departman = Departman::create([
            'naziv' => $request->naziv,
        ]);

        return response()->json([
            'message' => 'Departman uspešno dodat!',
            'departman' => $departman,
        ]);
    }
}
