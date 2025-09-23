<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

use App\Models\Predmet;
use App\Models\Materijal;
use App\Models\TipMaterijala;
use App\Models\Smer;
use App\Models\Korisnik;

use App\Mail\PrijaviMaterijal;

class KontrolerMaterijala extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $zahtev){
        try {
            if ($zahtev->has('stranica')) {
                $zahtev->merge(['page' => $zahtev->get('stranica')]);
            }

            $validiraniPodaci = $zahtev->validate([
                'podtip_materijala_id' => 'sometimes',
                'tip_materijala_id'    => 'sometimes',
                'predmet_id'           => 'sometimes',
                'smer_id'              => 'sometimes',
                'godina'               => 'sometimes',
                'skolska_godina'       => 'sometimes|string|max:20',
                'pretraga'             => 'sometimes|string|max:255',
                'kolonaSortiranja'     => 'sometimes|in:naziv,datum_dodavanja',
                'pravacSortiranja'     => 'sometimes|in:asc,desc',
                'poStranici'           => 'sometimes|integer|min:1|max:100',
            ]);

            $materijali = Materijal::filtriraj($validiraniPodaci);

            return response()->json($materijali);

        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'error' => 'Nevalidan unos.',
                'detalji' => $ve->errors()
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $mnfe) {
            return response()->json([
                'error' => 'Neki entitet nije pronađen u bazi.',
            ], 404);

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
    public function store(Request $zahtev){
       try {
            $validiraniPodaci = $zahtev->validate([
                'departman' => ['required'],
                'nivoStudija' => ['required'],
                'smer' => ['required'],
                'godina' => ['required'],
                'predmet' => ['required'],
                'tipMaterijala' => ['required'],
                'podtipMaterijala' => ['required'],
                'akademskaGodina' => ['required'],
                'korisnickiMejl' => ['required', 'email', 'max:255', 'regex:/^[\w\.-]+@pmf\.edu\.rs$/i'],
                'fajl' => ['required', 'file', 'mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,text/plain,application/vnd.oasis.opendocument.text,image/png,image/jpeg', 'max:20480'],
            ]);

            $departman = json_decode($zahtev->input('departman'), true);
            $nivoStudija = json_decode($zahtev->input('nivoStudija'), true);
            $smer = json_decode($zahtev->input('smer'), true);
            $godina = json_decode($zahtev->input('godina'), true);
            $predmet = json_decode($zahtev->input('predmet'), true);
            $tipMaterijala = json_decode($zahtev->input('tipMaterijala'), true);
            $podtipMaterijala = json_decode($zahtev->input('podtipMaterijala'), true);
            $akademskaGodina = str_replace('/', '-', $zahtev->input('akademskaGodina'));
            $korisnickiMejl = $zahtev->input('korisnickiMejl');
            $fajl = $zahtev->file('fajl');

            return Materijal::sacuvajMaterijala(
                $korisnickiMejl,
                $departman,
                $nivoStudija,
                $smer,
                $godina,
                $predmet,
                $tipMaterijala,
                $podtipMaterijala,
                $akademskaGodina,
                $fajl
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Neispravni podaci.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\JsonException | \ErrorException $e) {
            return response()->json([
                'message' => 'Greška u obradi podataka. Proveri format vrednosti.',
            ], 400);
        } catch (\Throwable $e) {
            \Log::error('Greška pri čuvanju materijala: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'message' => 'Došlo je do interne greške. Pokušaj ponovo kasnije.',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id){
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

    /**
     * Šalje mejl administratorima da provere prijavu.
     */
    public function prijaviMaterijal(Request $zahtev){
        $posiljaoc = $zahtev->input('posiljaoc');
        $materijalId = $zahtev->input('materijalId');
        $opisPrijave = $zahtev->input('opisPrijave');

        Mail::to('jankopetkovic@pmf-arhiv.com')->send(new PrijaviMaterijal($posiljaoc, $materijalId, $opisPrijave));

        return response()->json(['message' => 'Email sent successfully!']);
    }
}
