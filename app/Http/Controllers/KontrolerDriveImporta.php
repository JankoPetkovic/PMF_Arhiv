<?php

namespace App\Http\Controllers;

use App\Models\Materijal;
use App\Models\Predmet;
use App\Models\PodtipMaterijala;
use App\Models\TipMaterijala;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class KontrolerDriveImporta extends Controller
{
    private function proveraAdmina(): bool
    {
        /** @var \App\Models\Korisnik $korisnik */
        $korisnik = Auth::user();
        return $korisnik && $korisnik->tipUloge->naziv === 'Admin';
    }

    private function napraviDriveKlijent(): \Google\Service\Drive
    {
        $client = new \Google\Client();
        $client->setAuthConfig(storage_path('app/google-credentials.json'));
        $client->addScope(\Google\Service\Drive::DRIVE_READONLY);
        return new \Google\Service\Drive($client);
    }

    // Pronalazi najboljeg kandidata iz liste predmeta za dati naziv foldera
    private function predloziPredmet(array $segmenti, array $predmeti): ?array
    {
        $filtrirani = array_filter($segmenti, function ($s) {
            $s = trim($s);
            return !preg_match('/\d\s*[.\-]\s*(god(ina)?)?$/iu', $s)
                && !preg_match('/^(\d)\s*\.\s*god/iu', $s)
                && !preg_match('/^\d+$/', $s)
                && strlen($s) > 1;
        });

        $najboljaSl = 0;
        $najboljPredmet = null;

        foreach ($filtrirani as $seg) {
            $seg = mb_strtolower(trim($seg));
            foreach ($predmeti as $predmet) {
                similar_text($seg, mb_strtolower($predmet['naziv']), $sl);
                if ($sl > $najboljaSl) {
                    $najboljaSl = $sl;
                    $najboljPredmet = $predmet;
                }
            }
        }

        return $najboljaSl >= 45 ? $najboljPredmet : null;
    }

    private function extractGodina(array $segmenti): ?int
    {
        foreach ($segmenti as $seg) {
            if (preg_match('/^(\d)\s*[.\-]?\s*(god(ina)?)?$/iu', trim($seg), $m)) {
                $g = (int) $m[1];
                if ($g >= 1 && $g <= 4) return $g;
            }
        }
        return null;
    }

    private function listaFajlova(\Google\Service\Drive $drive, string $folderId, string $putanja = ''): array
    {
        $rezultati = [];
        $pageToken = null;
        $googleAppsPrefix = 'application/vnd.google-apps.';

        do {
            $params = [
                'q'      => "'{$folderId}' in parents and trashed = false",
                'fields' => 'nextPageToken, files(id, name, mimeType, size)',
                'pageSize' => 100,
            ];
            if ($pageToken) $params['pageToken'] = $pageToken;

            $resp = $drive->files->listFiles($params);

            foreach ($resp->getFiles() as $fajl) {
                $mime = $fajl->getMimeType();
                if ($mime === 'application/vnd.google-apps.folder') {
                    $novaPutanja = $putanja ? "{$putanja}/{$fajl->getName()}" : $fajl->getName();
                    $rezultati = array_merge($rezultati, $this->listaFajlova($drive, $fajl->getId(), $novaPutanja));
                } elseif (!str_starts_with($mime, $googleAppsPrefix)) {
                    $rezultati[] = [
                        'id'       => $fajl->getId(),
                        'naziv'    => $fajl->getName(),
                        'velicina' => (int) $fajl->getSize(),
                        'putanja'  => $putanja,
                    ];
                }
            }

            $pageToken = $resp->getNextPageToken();
        } while ($pageToken);

        return $rezultati;
    }

    public function prikaziStranu()
    {
        if (!Auth::check() || !$this->proveraAdmina()) {
            return redirect('/');
        }

        return Inertia::render('ImportDrive', [
            'tipoviMaterijala' => TipMaterijala::all(),
        ]);
    }

    public function vratiSadrzajFoldera(Request $request)
    {
        if (!Auth::check() || !$this->proveraAdmina()) {
            return response()->json(['message' => 'Nedovoljna prava pristupa'], 403);
        }

        $request->validate(['folder_id' => 'required|string|max:200']);

        set_time_limit(0);

        try {
            $drive = $this->napraviDriveKlijent();
            $svi   = $this->listaFajlova($drive, $request->input('folder_id'));

            $predmeti = Predmet::with(['smer.departman', 'smer.nivoStudija'])
                ->get()
                ->map(fn($p) => [
                    'predmet_id'      => $p->predmet_id,
                    'naziv'           => $p->naziv,
                    'godina'          => $p->godina,
                    'smer_id'         => $p->smer_id,
                    'smer'            => $p->smer->naziv_smera,
                    'nivo_studija_id' => $p->smer->nivo_studija_id,
                    'nivo_studija'    => $p->smer->nivoStudija->nivo_studija,
                    'departman_id'    => $p->smer->departman_id,
                    'departman'       => $p->smer->departman->naziv,
                ])
                ->toArray();

            $nazivi = array_column($svi, 'naziv');
            // Skup postojećih materijala ključevan po "naziv|predmet_id" — duplikat
            // se prepoznaje samo ako se poklope i ime i predmet.
            $postojeci = [];
            foreach (Materijal::whereIn('naziv', $nazivi)->get(['naziv', 'predmet_id']) as $m) {
                $postojeci[$m->naziv . '|' . $m->predmet_id] = true;
            }

            $obradjeni = array_map(function ($fajl) use ($predmeti, $postojeci) {
                $segmenti = $fajl['putanja'] ? explode('/', $fajl['putanja']) : [];
                $godina   = $this->extractGodina($segmenti);

                $predmetiFilter = $predmeti;
                if ($godina) {
                    $predmetiFilter = array_values(array_filter($predmeti, fn($p) => $p['godina'] === $godina));
                }

                $predlozenPredmet = $this->predloziPredmet($segmenti, $predmetiFilter ?: $predmeti);

                // Označi kao mogući duplikat samo ako postoji materijal sa istim
                // imenom i istim (predloženim) predmetom.
                $vecPostoji = $predlozenPredmet
                    && isset($postojeci[$fajl['naziv'] . '|' . $predlozenPredmet['predmet_id']]);

                return [
                    'drive_id'          => $fajl['id'],
                    'naziv'             => $fajl['naziv'],
                    'velicina'          => $fajl['velicina'],
                    'putanja'           => $fajl['putanja'],
                    'predlozena_godina' => $godina,
                    'predlozen_predmet' => $predlozenPredmet,
                    'vec_postoji'       => $vecPostoji,
                ];
            }, $svi);

            return response()->json([
                'fajlovi'  => array_values($obradjeni),
                'predmeti' => $predmeti,
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Greška pri pristupu Drive-u: ' . $e->getMessage()], 500);
        }
    }

    public function uveziFajlove(Request $request)
    {
        if (!Auth::check() || !$this->proveraAdmina()) {
            return response()->json(['message' => 'Nedovoljna prava pristupa'], 403);
        }

        $request->validate([
            'stavke'                        => 'required|array|min:1|max:50',
            'stavke.*.drive_id'             => 'required|string',
            'stavke.*.naziv'                => 'required|string|max:255',
            'stavke.*.predmet_id'           => 'required|integer|exists:predmet,predmet_id',
            'stavke.*.podtip_materijala_id' => 'required|integer|exists:podtip_materijala,podtip_materijala_id',
            'stavke.*.skolska_godina'       => 'required|string|max:20',
        ]);

        /** @var \App\Models\Korisnik $admin */
        $admin = Auth::user();

        set_time_limit(300);

        try {
            $drive = $this->napraviDriveKlijent();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Greška pri konekciji na Drive: ' . $e->getMessage()], 500);
        }

        $uspesnih = 0;
        $gresaka  = [];

        foreach ($request->input('stavke') as $stavka) {
            $tmpPutanja = null;
            try {
                $sadrzaj    = $drive->files->get($stavka['drive_id'], ['alt' => 'media']);
                $tmpPutanja = tempnam(sys_get_temp_dir(), 'drive_');
                file_put_contents($tmpPutanja, $sadrzaj->getBody()->getContents());

                $mimeType     = mime_content_type($tmpPutanja) ?: 'application/octet-stream';
                $uploadedFile = new UploadedFile($tmpPutanja, $stavka['naziv'], $mimeType, null, true);

                $predmet = Predmet::with(['smer.departman', 'smer.nivoStudija'])->findOrFail($stavka['predmet_id']);
                $podtip  = PodtipMaterijala::with('tip')->findOrFail($stavka['podtip_materijala_id']);

                Materijal::kreirajMaterijal(
                    $uploadedFile,
                    ['naziv' => $predmet->smer->departman->naziv],
                    ['nivo_studija_id' => $predmet->smer->nivo_studija_id, 'nivo_studija' => $predmet->smer->nivoStudija->nivo_studija],
                    ['smer_id' => $predmet->smer_id, 'naziv_smera' => $predmet->smer->naziv_smera],
                    ['naziv' => $predmet->godina . '. Godina'],
                    ['predmet_id' => $predmet->predmet_id, 'naziv' => $predmet->naziv],
                    ['naziv' => $podtip->tip->naziv],
                    ['podtip_materijala_id' => $podtip->podtip_materijala_id, 'naziv' => $podtip->naziv],
                    $stavka['skolska_godina'],
                    $admin->korisnik_id
                );

                $uspesnih++;

            } catch (\Throwable $e) {
                $gresaka[] = ['naziv' => $stavka['naziv'], 'greska' => $e->getMessage()];
            } finally {
                if ($tmpPutanja && file_exists($tmpPutanja)) {
                    @unlink($tmpPutanja);
                }
            }
        }

        $admin->zabeleziAkcijuKorisnika('Import', "Drive import: {$uspesnih} materijala uvezeno");

        return response()->json(['uspesnih' => $uspesnih, 'gresaka' => $gresaka]);
    }
}
