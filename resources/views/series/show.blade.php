@extends('layouts.app')

@section('content')

    <div class="section">
        <div class="container">

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

@endsection
