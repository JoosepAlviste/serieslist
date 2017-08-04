@extends('layouts.app')

@section('content')

    <div class="section">
        <div class="container">
            <h1 class="title has-tag">
                {{ $episode->title }}
                <a href="/episodes/{{ $episode->id }}/seen-episodes"
                   onclick="event.preventDefault();
                                document.getElementById('mark-as-seen-form').submit();">
                    @if ($episode->isSeen)
                        <span class="tag is-primary ml-1 is-medium has-hover">
                            Seen
                            <button class="delete is-medium"></button>
                        </span>
                    @else
                        <span class="tag is-default ml-1 is-medium has-hover">
                            Mark as seen
                        </span>
                    @endif
                </a>

                <form id="mark-as-seen-form"
                      method="POST"
                      action="/episodes/{{ $episode->id }}/seen-episodes">
                    {{ csrf_field() }}
                </form>
            </h1>

            <h2 class="subtitle">
                Episode {{ $episode->number }}
                <span class="vertical-delimiter">|</span>
                <a href="{{ $episode->season->path() }}">
                    Season {{ $episode->season->number }}
                </a>
                <span class="vertical-delimiter">|</span>
                Series
                <a href="{{ $episode->season->series->path() }}">
                    {{ $episode->season->series->title }}
                </a>
            </h2>

            <hr>

            <div class="content">

                Ethical church-key raclette, portland vice viral meditation man bun. Squid poke tumblr intelligentsia kinfolk yr. Heirloom copper mug coloring book polaroid kitsch. Fam hexagon typewriter jean shorts readymade gentrify raw denim street art kogi normcore chartreuse authentic synth. Ramps hexagon tilde, bitters shaman biodiesel beard mumblecore vinyl irony. Snackwave art party pickled typewriter, jean shorts DIY kale chips letterpress wayfarers. Pabst pok pok biodiesel, fashion axe poutine schlitz cray bespoke wolf pork belly ethical tattooed stumptown hella tousled. Occupy hoodie distillery craft beer lomo. Blue bottle brooklyn meditation kickstarter, cold-pressed messenger bag crucifix marfa celiac raclette woke poke tofu heirloom try-hard. Poke four dollar toast man bun jean shorts neutra sriracha. Austin blog 8-bit dreamcatcher. Photo booth thundercats plaid glossier echo park sriracha mixtape schlitz yr single-origin coffee normcore cardigan. YOLO polaroid helvetica, vegan kombucha narwhal la croix letterpress brunch.

                @if ($nextEpisode)
                    <div class="next-link__container">
                        <a href="{{ $nextEpisode->path() }}" class="button is-link">Next episode →</a>
                    </div>
                @endif

            </div>
        </div>
    </div>

@endsection
