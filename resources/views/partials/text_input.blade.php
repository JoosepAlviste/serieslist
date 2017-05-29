@component('partials.base.input', ['name' => $name, 'required' => $required])
    @slot('label')
        {{ $slot }}
    @endslot

    <input type="text"
           class="input {{ $errors->has($name) ? 'is-danger' : '' }}"
           id="{{ $name }}"
           value="{{ old($name) ?: '' }}"
           name="{{ $name }}"
            {{ $required ? 'required' : '' }}>

@endcomponent
