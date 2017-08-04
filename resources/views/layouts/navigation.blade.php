<nav class="navbar has-shadow">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
                Serieslist
            </a>

            <div class="navbar-burger" data-target="navbar">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <div class="navbar-menu" id="navbar">

            <div class="navbar-end">
                <a class="navbar-item {{ Request::is('series') ? 'is-active' : '' }}" href="{{ url('series') }}">
                    Series
                </a>

                @if (Auth::check())
                    <a class="navbar-item" href="{{ url('list') }}">
                        My list
                    </a>

                    <a class="navbar-item">
                        {{ Auth::user()->name }}
                    </a>

                    <a class="navbar-item"
                       href="{{ url('/logout') }}"
                       onclick="event.preventDefault();
                                document.getElementById('logout-form').submit();">
                        Logout
                    </a>

                    <form id="logout-form"
                          action="{{ url('/logout') }}"
                          method="POST"
                          style="display: none;">
                        {{ csrf_field() }}
                    </form>
                @else
                    <a class="navbar-item {{ Request::is('login') ? 'is-active' : '' }}"
                       href="{{ url('/login') }}">
                        Login
                    </a>
                    <a class="navbar-item {{ Request::is('register') ? 'is-active' : '' }}"
                       href="{{ url('/register') }}">
                        Register
                    </a>
                @endif
            </div>

        </div>
</nav>
