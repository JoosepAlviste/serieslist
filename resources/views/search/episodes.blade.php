@extends('layouts.app')

@section('pageTitle', 'Search episodes for "' . $q . '"')

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
            <h2 class="subtitle">Episodes</h2>
            <hr>
            <div class="columns">
                <div class="column is-two-thirds">
                    @if ($episodes->count() === 0)
                        <div class="content">
                            <p>No episodes found</p>
                        </div>
                    @else
                        <div class="content">
                            @include('episodes._episodes-list')
                        </div>

                        {{ $episodes->links('vendor/pagination/bulma') }}
                    @endif
                </div>
            </div>
        </section>
    </div>
@endsection
