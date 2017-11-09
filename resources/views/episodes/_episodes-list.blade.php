<ul>
    @foreach ($episodes as $episode)
        <li>
            <a href="{{ $episode->path() }}">
                {{ $episode->title }}
                @if ($episode->isSeen)
                    <span class="fa fa-check"></span>
                @endif
            </a>
        </li>
    @endforeach
</ul>
