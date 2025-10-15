<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Predmet;
use App\Models\Smer;

class KontrolerPredmeta extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $zahtev){
        try{
            $validiraniPodaci = $zahtev->validate([
                'godina'    => 'sometimes|integer|exists:predmet,godina|in:1,2,3',
                'smer_id'   => 'sometimes',
                'smer_id.*' => 'integer|exists:predmet,smer_id',
            ]);

            $predmeti = Predmet::filtriraj($validiraniPodaci);

            return response()->json($predmeti);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'error' => 'Nevalidan unos.',
                'detalji' => $ve->errors()
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $mnfe) {
            return response()->json([
                'error' => 'Neki entitet nije pronađen u bazi.',
            ], 404);

        } catch (\Illuminate\Database\QueryException $qe) {
            return response()->json([
                'error' => 'Greška u bazi podataka.',
                'detalji' => $qe->getMessage(),
            ], 500);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Došlo je do nepredviđene greške.',
                'detalji' => $e->getMessage(),
            ], 500);
        }
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
        $validacija = $zahtev->validate([
            'naziv' => 'required|string|max:255|unique:predmet,naziv',
            'smer.naziv_smera' => 'required|string|max:255',
            'godina.vrednost' => 'required|integer|max:3',
        ]);

        $smer = Smer::where('naziv_smera', $validacija['smer']['naziv_smera'])->first();
        if (!$smer) {
            return response()->json([
                'message' => "Departman '{$validacija['departman']}' nije pronađen.",
            ], 404);
        }

        if($validacija['godina']['vrednost'] < 0 || $validacija['godina']['vrednost'] > 4){
            return response()->json([
                'message' => "'{$validacija['godina']['naziv']}' nije pronađena.",
            ], 404);
        }
        $predmet = Predmet::create([
            'naziv' => $validacija['naziv'],
            'smer_id' => $smer->smer_id,
            'godina' => $validacija['godina']['vrednost'],
        ]);

        return response()->json([
            'message' => 'Predmet je uspešno kreiran.',
            'smer' => $predmet,
        ], 201);
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
