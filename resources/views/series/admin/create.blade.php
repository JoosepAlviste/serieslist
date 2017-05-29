@extends('layouts.form_page')

@section('title')
    Create a new series
@endsection

@section('form')

    <form action="/series" method="POST">
        {{ csrf_field() }}

        <div class="field">
            <label for="title" class="label">Title</label>

            <p class="control">
                <input type="text" class="input" id="title" name="title">
            </p>
        </div>

        <div class="field">
            <label for="description" class="label">Description</label>

            <p class="control">
                <textarea name="description" id="description" class="textarea"></textarea>
            </p>
        </div>

        <div class="columns">
            <div class="column field">
                <label for="start_year" class="label">Start year</label>

                <p class="control is-expanded">
                    <input type="number" class="input" step="1" id="start_year" name="start_year">
                </p>
            </div>

            <div class="column field">
                <label for="end_year" class="label">End year</label>

                <p class="control is-expanded">
                    <input type="number" class="input" step="1" id="end_year" name="end_year">
                </p>
            </div>
        </div>

        <div class="field is-grouped">
            <p class="control">
                <button type="submit" class="button is-primary">
                    Create
                </button>
            </p>
            <p class="control">
                <a class="button is-link" href="/series">
                    Cancel
                </a>
            </p>
        </div>
    </form>

@endsection
