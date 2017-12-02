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
                <div class="navbar-item">
                    <form action="/search" method="get">
                        <div class="field search__field">

                            <p class="control has-icons-left">

                                <input
                                        class="input"
                                        name="q"
                                        type="text"
                                        placeholder="Search..."
                                        value="{{ isset($q) ? $q : null }}"
                                        autocomplete="off"
                                >

                                <span class="icon is-left has-text-primary">
                                    <i class="fa fa-lg fa-search"></i>
                                </span>
                            </p>
                        </div>
                    </form>
                </div>

                <a
                    class="navbar-item {{ Request::is('series') ? 'is-active' : '' }}"
                    href="{{ url('series') }}"
                >
                    Series
                </a>

                @if (Auth::check())
                    <a class="navbar-item" href="{{ url('list') }}">
                        My list
                    </a>

                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            {{ Auth::user()->name }}
                        </a>

                        <div class="navbar-dropdown">
                            <a class="navbar-item" href="{{ url('/settings') }}">
                                Settings
                            </a>

                            <hr class="navbar-divider">

                            <a
                                    class="navbar-item"
                                    href="{{ url('/logout') }}"
                                    onclick="event.preventDefault();
                                             document.getElementById('logout-form').submit();"
                            >
                                Logout
                            </a>
                        </div>
                    </div>

                    <form id="logout-form"
                          action="{{ url('/logout') }}"
                          method="POST"
                          style="display: none;"
                    >
                        {{ csrf_field() }}
                    </form>
                @else
                    <a class="navbar-item {{ Request::is('login') ? 'is-active' : '' }}"
                       href="{{ url('/login') }}"
                    >
                        Login
                    </a>

                    <a class="navbar-item {{ Request::is('register') ? 'is-active' : '' }}"
                       href="{{ url('/register') }}"
                    >
                        Register
                    </a>
                @endif
            </div>

        </div>
</nav>
