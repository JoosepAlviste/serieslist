@extends('layouts.app')

@section('content')

    <h1>All series</h1>

    <ul>
        @foreach ($series as $oneSeries)
            <li>
                <a href="/series/{{ $oneSeries->id }}">
                    {{ $oneSeries->title }}
                </a>
            </li>
        @endforeach
    </ul>

@endsection
