@extends('layouts.app')

@section('pageTitle', $series->title)

@section('content')

    <div class="section">
        <div class="container">

            <div class="columns">
                <div class="column is-narrow">
                    @include('series.partials.poster-small')
                </div>

                <div class="column">
                    <h1 class="title">{{ $series->title }}</h1>
                    <h2 class="subtitle">{{ $series->start_year }} - {{ $series->end_year or '...' }}</h2>
                    <hr>

                    <div class="content">
                        <p>{{ $series->description }}</p>

                        @can('update', $series)
                            <a href="/series/{{ $series->id }}/edit" class="button is-default">
                                Edit
                            </a>
                        @endcan

                    </div>
                </div>
            </div>

        </div>
    </div>

    @if(!$series->seasons->isEmpty())

        <div class="section">
            <div class="container">
                <h1 class="title">Seasons</h1>
                <h2 class="subtitle">{{ $series->seasons->count() }} seasons</h2>
                <hr>

                <div class="content">
                    <ul>
                        @foreach($series->seasons as $season)
                            <li>
                                <a href="/series/{{ $series->id }}/seasons/{{ $season->number }}">
                                    Season {{ $season->number }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

    @endif

@endsection
