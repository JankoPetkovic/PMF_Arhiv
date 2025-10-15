<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Smer;
use App\Models\Departman;
use App\Models\NivoStudija;

class KontrolerSmerova extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $zahtev)
    {
        try {
            $validiraniPodaci = $zahtev->validate([
                'departman_id'      => 'sometimes|integer|exists:departman,departman_id',
                'nivo_studija_id'   => 'sometimes|integer|exists:nivo_studija,nivo_studija_id',
                'kolonaSortiranja'  => 'sometimes|string|in:naziv_smera,smer_id,nivo_studija_id',
                'pravacSortiranja'  => 'sometimes|string|in:asc,desc',
                'poStranici'        => 'sometimes|integer|min:1|max:100',
            ]);

            $smerovi = Smer::filtriraj($validiraniPodaci);

            return response()->json($smerovi);

        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'error'   => 'Nevalidan unos.',
                'detalji' => $ve->errors()
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $mnfe) {
            return response()->json([
                'error' => 'Neki entitet nije pronađen u bazi.',
            ], 404);

        } catch (\Illuminate\Database\QueryException $qe) {
            return response()->json([
                'error'   => 'Greška u bazi podataka.',
                'detalji' => $qe->getMessage(),
            ], 500);

        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Došlo je do nepredviđene greške.',
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
            'naziv' => 'required|string|max:255|unique:smer,naziv_smera',
            'departman.naziv' => 'required|string|max:255',
            'nivo_studija.nivo_studija' => 'required|string|max:100',
        ]);

        $departman = Departman::where('naziv', $validacija['departman']['naziv'])->first();
        if (!$departman) {
            return response()->json([
                'message' => "Departman '{$validacija['departman']}' nije pronađen.",
            ], 404);
        }

        $nivoStudija = NivoStudija::where('nivo_studija', $validacija['nivo_studija']['nivo_studija'])->first();
        if (!$nivoStudija) {
            return response()->json([
                'message' => "Nivo studija '{$validacija['nivo_studija']['nivo_studija']}' nije pronađen.",
            ], 404);
        }

        $smer = Smer::create([
            'naziv_smera' => $validacija['naziv'],
            'departman_id' => $departman->departman_id,
            'nivo_studija_id' => $nivoStudija->nivo_studija_id,
        ]);

        return response()->json([
            'message' => 'Smer je uspešno kreiran.',
            'smer' => $smer,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $podaci = Smer::prikaziSmer($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $mnfe) {
            return response()->json([
                'error' => 'Neki entitet nije pronađen u bazi.',
            ], 404);
        } catch (\ErrorException $e) {
            return response()->json([
                'error'=> 'Greška pri pristupanju relacijama – moguće da podaci nisu kompletni.'
            ], 500);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Došlo je do nepredviđene greške.',
                'detalji' => $e->getMessage(),
            ], 500);
        }
    
        return Inertia::render('Materijal', $podaci);
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
