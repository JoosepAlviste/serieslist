@extends('layouts.form_page')

@section('title')
    Edit {{ $series->title }}
@endsection

@section('form')

    <form action="/series/{{ $series->id }}" method="POST">
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

        <div class="field is-grouped">
            <p class="control">
                <button type="submit" class="button is-primary">
                    Save
                </button>
            </p>
            <p class="control">
                <a class="button is-link" href="/series/{{ $series->id }}">
                    Cancel
                </a>
            </p>
        </div>
    </form>

@endsection
