<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Departman;

class KontrolerDepartmana extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $departmani = Departman::all();

        return response()->json($departmani, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $zahtev)
    {   
        /** @var \App\Models\Korisnik $prijavljenKorisnik */
        $prijavljenKorisnik = Auth::user();
        $validacija = $zahtev->validate([
            'naziv' => 'required|string|max:255|unique:departman,naziv',
        ]);

        if($prijavljenKorisnik->tipUloge->naziv === "Admin"){
            $departman = Departman::create([
                'naziv' => $validacija['naziv']
            ]);
            $prijavljenKorisnik->zabeleziAkcijuKorisnika('Kreiranje', 'Kreiran departman: ' . $validacija['naziv']);
            return $departman;
        } else {
            return response()->json([
                'message' => 'Korisnik nema Admin privilegije',
            ], 401);
        }

        

        

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
