@extends('layouts.form_page')

@section('pageTitle', 'Edit ' . $series->title)

@section('title', 'Edit ' . $series->title)

@section('form')

    <form action="/series/{{ $series->id }}" method="POST" enctype="multipart/form-data">
        {{ method_field('PUT') }}
        {{ csrf_field() }}

        @component('partials.text_input',
                    ['name' => 'title', 'required' => true, 'value' => $series->title])
            Title
        @endcomponent

        @component('partials.textarea',
                    ['name' => 'description', 'required' => true, 'value' => $series->description])
            Description
        @endcomponent

        @if ($series->poster)
            <div class="columns">
                <div class="column is-narrow">
                    <img src="{{ asset('uploads/images/' . $series->poster . '-poster-small.png') }}" alt="{{ $series->title }}">
                </div>

                <div class="column">
                    <label class="label" for="poster">Poster</label>
                    <input class="mb-1" type="file" name="poster" id="poster">
                </div>
            </div>
        @else
            <label class="label" for="poster">Poster</label>
            <input class="mb-1" type="file" name="poster" id="poster">
        @endif

        <div class="columns">

            @component('partials.number_input', [
                            'name' => 'start_year',
                            'required' => true,
                            'fieldClass' => 'column',
                            'value' => $series->start_year,
                        ])
                Start year
            @endcomponent

            @component('partials.number_input', [
                            'name' => 'end_year',
                            'required' => false,
                            'fieldClass' => 'column',
                            'value' => $series->end_year,
                        ])
                End year
            @endcomponent

        </div>

        <seasons-list :initial-seasons="initialSeasons"></seasons-list>

        <div class="field is-grouped">
            <p class="control">
                <button type="submit" class="button is-primary">
                    Save
                </button>
            </p>
            <p class="control">
                <a class="button is-danger" href="/series/{{ $series->id }}/delete"
                   onclick="event.preventDefault();
                            document.getElementById('delete-series-form').submit()">
                    Delete
                </a>
            </p>
            <p class="control">
                <a class="button is-link" href="/series/{{ $series->id }}">
                    Cancel
                </a>
            </p>
        </div>
    </form>

    <form action="{{ $series->path() }}" method="POST" style="display: none;" id="delete-series-form">
        {{ csrf_field() }}
        {{ method_field('DELETE') }}
    </form>

@endsection

@section('scripts')

    <script>
        window.series = {!! $series->toJson() !!};
    </script>

    <script src="{{ asset('js/series_create.js') }}"></script>
@endsection
