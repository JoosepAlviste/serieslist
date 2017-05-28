@extends('layouts.app')

@section('content')

    <div class="columns">
        <div class="column is-half is-offset-one-quarter">
            <div class="card  form-card">

                <header class="card-header">
                    <p class="card-header-title">
                        @yield('title')
                    </p>
                </header>

                <div class="card-content">
                    @yield('form')
                </div>

            </div>
        </div>
    </div>

@endsection
