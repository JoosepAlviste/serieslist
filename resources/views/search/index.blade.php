@extends('layouts.app')

@section('pageTitle', 'Search for "' . $q . '"')

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

                        <div>
                            <a href="{{ route('search.series', ['q' => $q]) }}">See more series</a>
                        </div>
                    @endif
                </div>
            </div>

        </section>

        <section class="search-results section">

            <h2 class="subtitle">Episodes</h2>
            <hr>

            <div class="content">
                @if ($episodes->count() === 0)
                    <p>No episodes found</p>
                @else
                    <ul>
                        @foreach ($episodes as $episode)
                            <li>
                                <a href="{{ $episode->path() }}">
                                    {{ $episode->title }}
                                </a>
                            </li>
                        @endforeach
                    </ul>

                    <div>
                        <a href="{{ route('search.episodes', ['q' => $q]) }}">See more episodes</a>
                    </div>
                @endif
            </div>

        </section>
    </div>

@endsection
