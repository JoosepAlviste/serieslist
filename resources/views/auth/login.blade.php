@extends('layouts.form_page')

@section('title')
    Login
@endsection

@section('form')

    <form method="POST" action="{{ url('/login') }}">

    {{ csrf_field() }}

    <!-- Email -->
        <div class="field">
            <label for="email" class="label">E-Mail Address</label>
            <p class="control {{ $errors->has('email') ? 'has-icon has-icon-right' : '' }}">
                <input class="input {{ $errors->has('email') ? 'is-danger': '' }}"
                       type="text"
                       id="email"
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
        </div>

        <!-- Password -->
        <div class="field">
            <label for="password" class="label">Password</label>
            <p class="control {{ $errors->has('password') ? 'has-icon has-icon-right' : '' }}">
                <input class="input {{ $errors->has('password') ? 'is-danger': '' }}"
                       type="password"
                       id="password"
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
        </div>

        <div class="field">
            <!-- Remember Me -->
            <p class="control">
                <label class="checkbox">
                    <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}>
                    Remember me
                </label>
            </p>
        </div>

        <!-- Buttons -->
        <div class="field is-grouped">
            <p class="control">
                <button class="button is-primary" type="submit">
                    Login
                </button>
            </p>
            <p class="control">
                <a class="button is-link" href="{{ url('/password/reset') }}">
                    Forgot Your Password?
                </a>
            </p>
        </div>

    </form>

@endsection
