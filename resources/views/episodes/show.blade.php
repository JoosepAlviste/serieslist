@extends('layouts.app')

@section('content')

    <div class="section">
        <div class="container">
            <h1 class="title has-tag">
                {{ $episode->title }}
                <a href="/episodes/{{ $episode->id }}/seen-episodes"
                   onclick="event.preventDefault();
                                document.getElementById('mark-as-seen-form').submit();">
                    @if ($episode->isSeen)
                        <span class="tag is-primary ml-1 is-medium has-hover">
                            Seen
                            <button class="delete is-medium"></button>
                        </span>
                    @else
                        <span class="tag is-default ml-1 is-medium has-hover">
                            Mark as seen
                        </span>
                    @endif
                </a>
            </h1>

            <form id="mark-as-seen-form"
                  method="POST"
                  action="/episodes/{{ $episode->id }}/seen-episodes">
                {{ csrf_field() }}
            </form>

            <hr>

            <div class="content">

                An episode of
                <a href="{{ $episode->season->series->path() }}">{{ $episode->season->series->title }}</a>.

                <div class="next-episode__container">
                    <a href="{{ $episode->nextEpisode()->path() }}" class="button is-link">Next episode →</a>
                </div>

            </div>
        </div>
    </div>

@endsection
