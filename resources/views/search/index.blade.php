@extends('layouts.app')

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

            <div class="content">
                @if ($series->count() === 0)
                    <p>No series found</p>
                @else
                    <ul>
                        @foreach ($series as $oneSeries)
                            <li>
                                <a href="{{ $oneSeries->path() }}">
                                    {{ $oneSeries->title }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                @endif
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
                @endif
            </div>

        </section>
    </div>

@endsection
