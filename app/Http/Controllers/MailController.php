<?php

namespace App\Http\Controllers;
use App\Mail\PrijaviMaterijal;
use App\Mail\Verifikacija;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;


use App\Models\Korisnik;
use App\Models\Materijal;


class MailController extends Controller
{

    public function prijaviMaterijal(Request $request){
        $posiljaoc = $request->input('posiljaoc');
        $materijalId = $request->input('materijalId');
        $opisPrijave = $request->input('opisPrijave');

        Mail::to('jankopetkovic@pmf-arhiv.com')->send(new PrijaviMaterijal($posiljaoc, $materijalId, $opisPrijave));

        return response()->json(['message' => 'Email sent successfully!']);
    }

    public function posaljiVerifikaciju (Request $zahtev){
        $mejl = $zahtev->input('mejl');

        $link = URL::temporarySignedRoute(
            'verifikuj.mejl',
            Carbon::now()->addMinutes(10),
            ['id' => 9]
        );

        Mail::to($mejl)->send(new Verifikacija($mejl, $link));

        return response()->json([$mejl, 200]);
    }

    public function obradiVerifikaciju($id){
        if (!request()->hasValidSignature()) {
            abort(403, 'Link nije validan ili je istekao.');
        }

        $korisnik = Korisnik::findOrFail($id);
        $korisnik->verifikovan = true;
        $korisnik->datum_verifikacije = Carbon::now();
        $korisnik->save();

        $keširaniMaterijal = Cache::pull('materijal_cekaj_' . $korisnik->korisnik_id);

        if ($keširaniMaterijal) {
        $fajl = new UploadedFile(
            storage_path('app/public/' . $keširaniMaterijal['putanja_fajla']),
            basename($keširaniMaterijal['putanja_fajla'])
        );

        $putanja = Materijal::kreirajMaterijal(
            $fajl,
            $keširaniMaterijal['departman'],
            $keširaniMaterijal['nivoStudija'],
            $keširaniMaterijal['smer'],
            $keširaniMaterijal['godina'],
            $keširaniMaterijal['predmet'],
            $keširaniMaterijal['tipMaterijala'],
            $keširaniMaterijal['podTipMaterijala'],
            $keširaniMaterijal['akademskaGodina'],
            $id
        );
        Storage::disk('public')->delete($keširaniMaterijal['putanja_fajla']);

        }

        return 'Uspešno ste verifikovali mejl.';
    }
}
