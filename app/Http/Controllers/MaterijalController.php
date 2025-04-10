<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Predmet;

class MaterijalController extends Controller
{
    public function get_predmeti($id)
    {
        $predmeti = Predmet::where('smer_id', $id)->get();

        return Inertia::render('Materijal', [
            'id' => $id,
            'predmeti' => $predmeti,
        ]);
    }

    public function get_materijal(Request $request)
    {
        
    }
}
