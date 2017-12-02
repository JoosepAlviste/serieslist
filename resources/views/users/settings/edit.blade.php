@extends('layouts.app')

@section('pageTitle', 'Settings')

@section('content')
    <div class="container">

        <section class="section">
            <h1 class="title">Change password</h1>
            <hr>
            <div class="columns">
                <div class="column is-one-third">
                    <form action="/settings/password" method="post">
                        {{ csrf_field() }}

                        @component('partials.text_input',
                                ['name' => 'current-password', 'required' => true, 'type' => 'password'])
                            Current password
                        @endcomponent

                        @component('partials.text_input',
                                ['name' => 'new-password', 'required' => true, 'type' => 'password'])
                            New password
                        @endcomponent

                        @component('partials.text_input',
                                ['name' => 'confirm-new-password', 'required' => true, 'type' => 'password'])
                            Confirm new password
                        @endcomponent

                        <button type="submit" class="button is-primary">
                            Change password
                        </button>
                    </form>
                </div>
            </div>
        </section>

    </div>
@endsection
