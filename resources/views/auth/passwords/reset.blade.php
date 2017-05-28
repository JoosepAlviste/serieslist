@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="columns">

            <div class="column is-half is-offset-one-quarter">

                <div class="card  login-card">

                    <header class="card-header">
                        <p class="card-header-title">
                            Reset Password
                        </p>
                    </header>

                    <div class="card-content">
                        <div class="content">

                            @if (session('status'))
                                <div class="notification is-success">
                                    {{ session('status') }}
                                </div>
                            @endif

                            <form method="POST" action="{{ url('/password/reset') }}">

                            {{ csrf_field() }}

                            <!-- Email -->
                                <label for="email" class="label">E-Mail Address</label>

                                <p class="control {{ $errors->has('email') ? 'has-icon has-icon-right' : '' }}">
                                    <input class="input {{ $errors->has('email') ? 'is-danger': '' }}"
                                           type="text"
                                           name="email"
                                           value="{{ old('email') }}"
                                           required autofocus>

                                    @if ($errors->has('email'))
                                        <span class="icon is-small">
                                            <i class="fa fa-warning"></i>
                                        </span>

                                        <span class="help is-danger">{{ $errors->first('email') }}</span>
                                    @endif
                                </p>

                                <label for="password" class="label">Password</label>

                                <p class="control {{ $errors->has('password') ? 'has-icon has-icon-right' : '' }}">
                                    <input class="input {{ $errors->has('password') ? 'is-danger': '' }}"
                                           type="password"
                                           name="password"
                                           value="{{ old('password') }}"
                                           required>

                                    @if ($errors->has('password'))
                                        <span class="icon is-small">
                                        <i class="fa fa-warning"></i>
                                    </span>

                                        <span class="help is-danger">{{ $errors->first('password') }}</span>
                                    @endif
                                </p>

                                <label for="password_confirmation" class="label">Confirm Password</label>

                                <p class="control {{ $errors->has('password_confirmation') ? 'has-icon has-icon-right' : '' }}">
                                    <input class="input {{ $errors->has('password_confirmation') ? 'is-danger': '' }}"
                                           type="password"
                                           name="password_confirmation"
                                           value="{{ old('password_confirmation') }}"
                                           required>

                                    @if ($errors->has('password_confirmation'))
                                        <span class="icon is-small">
                                            <i class="fa fa-warning"></i>
                                        </span>

                                        <span class="help is-danger">{{ $errors->first('password_confirmation') }}</span>
                                    @endif
                                </p>

                                <p class="control">
                                    <button type="submit" class="button is-primary">
                                        Reset Password
                                    </button>
                                </p>

                            </form>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

@endsection
