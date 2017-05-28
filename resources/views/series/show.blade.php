@extends('layouts.app')

@section('content')

    <h1 class="title">{{ $series->title }}</h1>
    <h2 class="subtitle">{{ $series->start_year }} - {{ $series->end_year or '...' }}</h2>

    <p>{{ $series->description }}</p>

@endsection
