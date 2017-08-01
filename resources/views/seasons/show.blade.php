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
                                @if ($episode->isSeen)
                                    <span class="tag is-small is-primary">
                                        Seen
                                    </span>
                                @endif
                            </a>
                        </li>
                    @endforeach
                </ul>

                @if ($nextSeason)
                    <div class="next-link__container">
                        <a href="{{ $nextSeason->path() }}" class="button is-link">
                            Next season →
                        </a>
                    </div>
                @endif

            </div>
        </div>
    </div>

@endsection
