<li class="series-list__element">

    <div class="series-list__element-container">

        <div class="series-list__poster">
            <a href="{{ $series->path() }}">
                @include('series.partials.poster-thumbnail', ['series' => $series])
            </a>
        </div>

        <div class="series-list__content-container">

            <h3 class="subtitle series-list__title">
                <a href="{{ $series->path() }}">
                    {{ $series->title }}
                </a>
            </h3>

            <p>{{ $series->description }}</p>

        </div>

    </div>

</li>
