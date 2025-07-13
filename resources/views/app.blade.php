<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PMF-Arhiv</title>
    <link rel="icon" href="{{ asset('images/android-chrome-512x512.png') }}" type="image/svg+xml">
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>
<body>
    @inertia

       
</body>
</html >