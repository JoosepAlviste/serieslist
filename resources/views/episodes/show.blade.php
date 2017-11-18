@extends('layouts.app')

@section('pageTitle', $episode->title)

@section('content')

    <div class="section">
        <div class="container">
            <h1 class="title has-tag">
                {{ $episode->title }}
                <episode-seen-tag
                        class="ml-1"
                        :item-id="{{ $episode->id }}"
                        :is-seen="{{ $episode->isSeen ? 'true' : 'false' }}"
                >
                </episode-seen-tag>
            </h1>

            <h2 class="subtitle">
                Episode {{ $episode->number }}
                <span class="vertical-delimiter">|</span>
                <a href="{{ $episode->season->path() }}">
                    Season {{ $episode->season->number }}
                </a>
                <span class="vertical-delimiter">|</span>
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
