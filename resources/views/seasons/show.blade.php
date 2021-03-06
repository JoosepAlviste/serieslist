@extends('layouts.app')

@section('pageTitle', "Season {$season->number} of {$season->series->title}")

@section('content')

    <div class="section">
        <div class="container">
            <h1 class="title">
                Season {{ $season->number }} of
                <a href="{{ $season->series->path() }}">
                    {{ $season->series->title }}
                </a>
                @if ($isSeen)
                    <span class="tag is-primary ml-1 is-medium">
                        Seen
                    </span>
                @else
                    <a href="/seasons/{{ $season->id }}/seen-episodes"
                       onclick="event.preventDefault();
                                document.getElementById('mark-as-seen-form').submit();">
                        <span class="tag is-default ml-1 is-medium has-hover">
                            Mark as seen
                        </span>
                    </a>

                    <form id="mark-as-seen-form"
                          method="POST"
                          action="/seasons/{{ $season->id }}/seen-episodes">
                        {{ csrf_field() }}
                    </form>
                @endif
            </h1>
            <hr>

            <div class="content">

                <ul>
                    @foreach($season->episodes as $episode)
                        <li>
                            <a href="{{ $episode->path() }}">
                                {{ $episode->title }}
                                @if ($episode->isSeen)
                                    <span class="fa fa-check"></span>
                                @endif
                            </a>
                        </li>
                    @endforeach
                </ul>

                <div class="links__container">
                    <div>
                        @if ($previousSeason)
                            <a href="{{ $previousSeason->path() }}" class="button is-link">
                                ← Previous season
                            </a>
                        @endif
                    </div>

                    <div>
                        @if ($nextSeason)
                            <a href="{{ $nextSeason->path() }}" class="button is-link">
                                Next season →
                            </a>
                        @endif
                    </div>
                </div>

            </div>
        </div>
    </div>

@endsection
