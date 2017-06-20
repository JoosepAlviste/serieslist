@extends('layouts.form_page')

@section('title')
    Register
@endsection

@section('form')

    <form method="POST" action="{{ url('/register') }}">
    {{ csrf_field() }}

    <!-- Name -->
        <div class="field">
            <label for="name" class="label required">Name</label>
            <p class="control {{ $errors->has('name') ? 'has-icon has-icon-right' : '' }}">
                <input class="input {{ $errors->has('name') ? 'is-danger': '' }}"
                       type="text"
                       id="name"
                       name="name"
                       value="{{ old('name') }}"
                       required autofocus>

                @if ($errors->has('name'))
                    <span class="icon is-small">
                        <i class="fa fa-warning"></i>
                    </span>

                    <span class="help is-danger">{{ $errors->first('name') }}</span>
                @endif
            </p>
        </div>

        <!-- Email -->
        <div class="field">
            <label for="email" class="label required">E-Mail Address</label>
            <p class="control {{ $errors->has('email') ? 'has-icon has-icon-right' : '' }}">
                <input class="input {{ $errors->has('email') ? 'is-danger': '' }}"
                       type="text"
                       id="email"
                       name="email"
                       value="{{ old('email') }}"
                       required>

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
            <label for="password" class="label required">Password</label>
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

        <!-- Password confirm -->
        <div class="field">
            <label for="password_confirmation" class="label required">Confirm Password</label>
            <p class="control">
                <input type="password"
                       class="input"
                       id="password_confirmation"
                       name="password_confirmation"
                       required>
            </p>
        </div>

        <div class="field">
            <p class="control">
                <button type="submit" class="button is-primary">Register</button>
            </p>
        </div>

    </form>

@endsection
