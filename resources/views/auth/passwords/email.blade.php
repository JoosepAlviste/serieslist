@extends('layouts.form_page')

@section('title')
    Reset Password
@endsection

@section('form')

    @if (session('status'))
        <div class="notification is-success">
            {{ session('status') }}
        </div>
    @endif

    <form method="POST" action="{{ url('/password/email') }}">

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

        <div class="field">
            <p class="control">
                <button type="submit" class="button is-primary">
                    Send Password Reset Link
                </button>
            </p>
        </div>

    </form>

@endsection
