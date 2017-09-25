@extends('layouts.app')

@section('pageTitle', 'Search series for "' . $q . '"')

@section('content')
    <section class="hero is-primary">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    Search results for "{{ $q }}"
                </h1>
            </div>
        </div>
    </section>

    <div class="container">
        <section class="search-results section">
            <h2 class="subtitle">Series</h2>
            <hr>

            <div class="columns">
                <div class="column is-two-thirds">
                    @if ($series->count() === 0)
                        <p>No series found</p>
                    @else
                        @include('series.partials.series-list')

                        {{ $series->links('vendor/pagination/bulma') }}
                    @endif
                </div>
            </div>
        </section>
    </div>
@endsection
