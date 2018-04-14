<!doctype html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicons/apple-touch-icon.png?v=pgq38q4lAN') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicons/favicon-32x32.png?v=pgq38q4lAM') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicons/favicon-16x16.png?v=pgq38q4lAN') }}">
    <link rel="manifest" href="{{ asset('favicons/manifest.json?v=pgq38q4lAN') }}">
    <link rel="mask-icon" href="{{ asset('favicons/safari-pinned-tab.svg?v=pgq38q4lAN') }}" color="#7767c6">
    <link rel="shortcut icon" href="{{ asset('favicons/favicon.ico?v=pgq38q4lAN') }}">
    <meta name="msapplication-config" content="{{ asset('favicons/browserconfig.xml?v=pgq38q4lAN') }}">
    <meta name="theme-color" content="#ffffff">

    <title>Serieslist</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">

    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
<section class="hero is-primary is-fullheight is-bold">

    <div class="hero-head">
        <header class="nav">
            <div class="container">

                <div class="nav-left">
                    <a class="nav-item" href="/">
                        Serieslist
                    </a>
                </div>

                <span class="nav-toggle" data-target="navbar">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>

                <div class="nav-right nav-menu" id="navbar">
                    @if (Auth::check())
                        <a class="nav-item" href="{{ url('/list/in-progress') }}">My list</a>
                        <a class="nav-item" href="{{ url('/series') }}">Series</a>
                    @else
                        <a class="nav-item" href="{{ url('/login') }}">Login</a>
                        <a class="nav-item" href="{{ url('/register') }}">Register</a>
                    @endif
                </div>
            </div>
        </header>
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
        <div class="container has-text-centered">
            <h1 class="title">
                Serieslist!!
            </h1>
        </div>
    </div>

</section>

<script src="{{ asset('/js/app.js') }}"></script>

</body>
</html>
