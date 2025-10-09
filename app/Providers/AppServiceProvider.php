<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
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
                $korisnik = auth()->user();
                    return [
                    'korisnik' => $korisnik? [
                        'id' => $korisnik->korisnik_id,
                        'ime' => $korisnik->ime,
                        'email' => $korisnik->email,
                    ] : null,
                ];
            },
            'ulogovanKorisnik' => function(){
                $korisnik = auth()->user();
                 return $korisnik ? [
                    'id' => $korisnik->korisnik_id,
                    'ime' => $korisnik->ime,
                    'email' => $korisnik->email,
                ] : null;
            },
        ]);
    }
}
