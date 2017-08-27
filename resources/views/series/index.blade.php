@extends('layouts.app')

@section('content')

    <div class="section">
        <div class="container">

            <h1 class="title series-list__page-title">
                All series

                @can('create', \App\Models\Series::class)
                    <a href="/series/create" class="button is-primary">
                        Add a new series
                    </a>
                @endcan

            </h1>
            <hr>

            <div class="columns">
                <ul class="series-list column is-two-thirds">
                    {{-- TODO: Move this to a series-list-element partial for better stuffs --}}
                    @foreach ($series as $oneSeries)
                        @include('series.partials.one-series', ['series' => $oneSeries])
                    @endforeach
                </ul>
            </div>

        </div>
    </div>

@endsection
