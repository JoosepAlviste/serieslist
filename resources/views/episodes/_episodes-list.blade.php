<ul>
    @foreach ($episodes as $episode)
        <li>
            <a href="{{ $episode->path() }}">
                {{ $episode->title }}
            </a>
        </li>
    @endforeach
</ul>
