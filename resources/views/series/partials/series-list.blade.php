<ul class="series-list">
    @foreach ($series as $oneSeries)
        @include('series.partials.one-series', ['series' => $oneSeries])
    @endforeach
</ul>
