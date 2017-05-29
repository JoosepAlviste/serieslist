@extends('layouts.app')

@section('content')

    <div class="section">
        <div class="container">

            <h1 class="title">All series</h1>
            <hr>

            <div class="content">
                <ul>
                    @foreach ($series as $oneSeries)
                        <li>
                            <a href="/series/{{ $oneSeries->id }}">
                                {{ $oneSeries->title }}
                            </a>
                        </li>
                    @endforeach
                </ul>

                <a href="/series/create" class="button is-primary">
                    Add a new series
                </a>
            </div>

        </div>
    </div>

@endsection
