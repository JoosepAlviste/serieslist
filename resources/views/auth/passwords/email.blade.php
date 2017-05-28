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

                            <form method="POST" action="{{ url('/password/email') }}">

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

                                <p class="control">
                                    <button type="submit" class="button is-primary">
                                        Send Password Reset Link
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
