<nav class="nav has-shadow">
    <div class="container">

        <div class="nav-left">
            <a class="nav-item {{ Request::is('/') ? 'is-active' : '' }}" href="{{ url('/') }}">
                {{ config('app.name', 'Serieslist') }}
            </a>

            @if (Auth::check())
                <a href="{{ url('/home') }}"
                   class="nav-item is-hidden-mobile {{ Request::is('home') ? 'is-active' : '' }}">
                    Home
                </a>
            @endif

            <a href="{{ url('series') }}"
               class="nav-item is-hidden-mobile {{ Request::is('series') ? 'is-active' : '' }}">
                Series
            </a>

            {{--@if (Auth::check())--}}
                {{--<a href="{{ url('list') }}"--}}
                   {{--class="nav-item is-hidden-mobile {{ Request::is('list') ? 'is-active' : '' }}">--}}
                    {{--My List--}}
                {{--</a>--}}
            {{--@endif--}}
        </div>

        <span class="nav-toggle">
            <span></span>
            <span></span>
            <span></span>
        </span>

        <div class="nav-right nav-menu">

            <a href="{{ url('home') }}" class="nav-item is-hidden-tablet {{ Request::is('home') ? 'is-active' : '' }}">
                Home
            </a>

            <a href="{{ url('series') }}"
               class="nav-item is-hidden-tablet {{ Request::is('series') ? 'is-active' : '' }}">
                Series
            </a>

            {{--@if (Auth::check())--}}
                {{--<a href="{{ url('list') }}"--}}
                   {{--class="nav-item is-hidden-tablet {{ Request::is('list') ? 'is-active' : '' }}">My List</a>--}}
            {{--@endif--}}

            @if (Auth::guest())
                <a class="nav-item {{ Request::is('login') ? 'is-active' : '' }}" href="{{ url('/login') }}">Login</a>
                <a class="nav-item {{ Request::is('register') ? 'is-active' : '' }}" href="{{ url('/register') }}">Register</a>
            @else
                <a class="nav-item">
                    {{ Auth::user()->name }}
                </a>
                <a class="nav-item" href="{{ url('/logout') }}"
                   onclick="event.preventDefault();
                                document.getElementById('logout-form').submit();">
                    Logout
                </a>

                <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
                    {{ csrf_field() }}
                </form>
            @endif
        </div>

    </div>
</nav>
