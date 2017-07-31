@component('partials.base.input', ['name' => $name, 'required' => $required])
    @slot('label')
        {{ $slot }}
    @endslot

    <textarea class="textarea {{ $errors->has($name) ? 'is-danger' : '' }}"
              id="{{ $name }}"
              name="{{ $name }}"
              rows="{{ isset($rows) ? $rows: 6 }}"
              {{ $required ? 'required' : '' }}>{{ isset($value) ? $value : (old($name) ?: '') }}</textarea>

@endcomponent
