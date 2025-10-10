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
                /** @var \App\Models\Korisnik $korisnik */
                $korisnik = Auth::user();
                if($korisnik)
                    return $korisnik->prikaziKorisnika();
                else 
                    return null;
            },
            'ulogovanKorisnik' => function(){
                /** @var \App\Models\Korisnik $korisnik */
                $korisnik = Auth::user();
                if($korisnik)
                    return $korisnik->prikaziKorisnika();
                else 
                    return null;
            },
        ]);
    }
}
