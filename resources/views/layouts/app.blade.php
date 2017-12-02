<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png?v=pgq38q4lAN">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png?v=pgq38q4lAN">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png?v=pgq38q4lAN">
    <link rel="manifest" href="/favicons/manifest.json?v=pgq38q4lAN">
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg?v=pgq38q4lAN" color="#7767c6">
    <link rel="shortcut icon" href="/favicons/favicon.ico?v=pgq38q4lAN">
    <meta name="msapplication-config" content="/favicons/browserconfig.xml?v=pgq38q4lAN">
    <meta name="theme-color" content="#ffffff">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('pageTitle') - Serieslist</title>

    <!-- Styles -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">

    <script>
        window.App = {
            @if (auth()->check())
                user: {!! auth()->user()->toJson() !!},
            @endif
        };
    </script>
</head>
<body>
    <div id="app" class="site">
        @include('layouts.navigation')

        <div class="site-content">
            @yield('content')
        </div>

        @include('layouts.footer')

        <app-notifications></app-notifications>
    </div>

    @yield('scripts-before-main')

    <script src="{{ asset('/js/app.js') }}"></script>

    @yield('scripts')

    <script>
        var status = '{!! session('status') ? session('status') : false !!}';

        if (status) {
            window.Events.$emit('show-notification', { message: status, type: 'success' });
        }

    </script>
</body>
</html>
