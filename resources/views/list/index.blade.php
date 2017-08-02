@extends('layouts.app')

@section('content')

    <section class="hero is-medium is-primary hero--bottom-padding">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    My series list
                </h1>
            </div>
        </div>
    </section>

    <div class="container series-list__container card">
        <series-list></series-list>
    </div>

@endsection

@section('scripts')
    <script src="{{ asset('js/list.js') }}"></script>
@endsection
