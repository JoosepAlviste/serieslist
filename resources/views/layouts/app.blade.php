<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

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
    </div>

    <script src="{{ asset('/js/app.js') }}"></script>

    @yield('scripts')
</body>
</html>
