@extends('layouts.app')

@section('content')

    <section class="hero is-primary">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    MySeriesList
                </h1>
                <h2 class="subtitle">
                    Admin page
                </h2>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">

            <h1 class="title">Series</h1>
            <h2 class="subtitle">
                Administering Series
            </h2>
            <hr>

            <div class="content">
                <a href="{{ url('series') }}">All Series</a><br>
                <a href="{{ url('series/create') }}">Add a new Series</a>
            </div>

        </div>
    </section>

@endsection
