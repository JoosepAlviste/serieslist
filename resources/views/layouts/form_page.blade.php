@extends('layouts.app')

@section('content')

    <div class="columns">
        <div class="column is-one-third is-offset-one-third">
            <div class="card form-card mb-1">

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

@section('scripts')
    @yield('scripts')
@endsection
