@extends('layouts.app')

@section('content')

    <div class="section">
        <div class="container">
            <h1 class="title">{{ $episode->title }}</h1>
            <hr>

            <div class="content">

                An episode of
                <a href="{{ $episode->season->series->path() }}">{{ $episode->season->series->title }}</a>.

            </div>
        </div>
    </div>

@endsection
