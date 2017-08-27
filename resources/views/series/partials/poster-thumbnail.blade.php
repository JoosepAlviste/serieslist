<figure class="image is-103x150">
    @if ($series->poster)
        <img src="{{ asset('uploads/images/' . $series->poster . '-poster-small.png') }}" alt="">
    @else
        <img src="{{ asset('images/placeholder_poster_small.png') }}" alt="">
    @endif
</figure>
