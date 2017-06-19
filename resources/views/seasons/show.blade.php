@extends('layouts.app')

@section('content')

    <div class="section">
        <div class="container">
            <h1 class="title">
                Season {{ $season->number }} of
                <a href="{{ $season->series->path() }}">
                    {{ $season->series->title }}
                </a>
            </h1>
            <hr>

            <div class="content">

                <ul>
                    @foreach($season->episodes as $episode)
                        <li>
                            <a href="{{ $episode->path() }}">
                                {{ $episode->title }}
                            </a>
                        </li>
                    @endforeach
                </ul>

            </div>
        </div>
    </div>

@endsection
