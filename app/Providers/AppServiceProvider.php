<?php

namespace App\Providers;

use App\Models\Korisnik;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },
            'auth' => function(){
                $korisnik = Auth::user();
                return Korisnik::prikaziKorisnika($korisnik->korisnik_id);
            },
            'ulogovanKorisnik' => function(){
                $korisnik = Auth::user();
                return Korisnik::prikaziKorisnika($korisnik->korisnik_id);
            },
        ]);
    }
}
