<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\PodtipMaterijala;

class KontrolerPodtipovaMaterijala extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $zahtev)
    {
        try{
            $validiraniPodaci = $zahtev->validate([
                'tip_materijala_id' => 'sometimes|integer|exists:tip_materijala,tip_materijala_id',
            ]);

            $podTipoviMaterijala = PodtipMaterijala::filtriraj($validiraniPodaci);

            return response()->json($podTipoviMaterijala);
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
        //
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
