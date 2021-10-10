<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Software to allow anyone to replicate Dean Radin's presentiment experiments.">
        <meta name="author" content="Matthew Riddle, Consciousness Matters">

        <title>{{ config('app.name') }}</title>

        <!-- Copy out to static to enhance privacy - BEGIN -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
        <!-- Copy out to static to enhance privacy - END -->

        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        <script src="{{ asset('js/app.js') }}" defer></script>
    </head>
    <body>
        {{ $slot }}
    </body>
</html>
