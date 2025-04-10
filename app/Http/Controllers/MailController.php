<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\VerifikacijaKorisnika;

class MailController extends Controller
{
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
}
