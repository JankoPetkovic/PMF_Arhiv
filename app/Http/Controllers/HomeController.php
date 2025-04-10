<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Departman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;


class HomeController extends Controller
{
    public function index()
    {
        $departmani = Departman::with(['smerovi.nivoStudija'])->get();

        $data = $departmani->map(function ($departman) {
            $nivoGrouped = [];
        
            foreach ($departman->smerovi as $smer) {
                $nivo = $smer->nivoStudija->nivo_studija;
        
                if (!isset($nivoGrouped[$nivo])) {
                    $nivoGrouped[$nivo] = [];
                }
        
                $nivoGrouped[$nivo][] = [
                    'id' => $smer->smer_id,
                    'naziv' => $smer->naziv_smera,
                ];
            }
        
            return [
                'departman_naziv' => $departman->naziv,
                'departman_id' => $departman->departman_id,
                'nivo_studija' => $nivoGrouped
            ];
        });

        return Inertia::render('Home', [
            'smerovi' => $data,  
        ]);
    }

    
}
