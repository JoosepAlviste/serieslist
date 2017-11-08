<figure class="image is-182x268">
    @if ($series->poster)
        <img src="{{ asset('storage/posters/' . $series->poster . '-poster-small.png') }}" alt="">
    @else
        <img src="{{ asset('images/placeholder_poster_small.png') }}" alt="">
    @endif
</figure>
