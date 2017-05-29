@component('partials.base.input', [
                                    'name' => $name,
                                    'required' => $required,
                                    'fieldClass' => isset($fieldClass) ? $fieldClass : ''
                                  ]
)
    @slot('label')
        {{ $slot }}
    @endslot

    <input type="number"
           class="input {{ $errors->has($name) ? 'is-danger' : '' }}"
           id="{{ $name }}"
           value="{{ old($name) ?: '' }}"
           name="{{ $name }}"
           step="{{ isset($step) ? $step : 1 }}"
            {{ $required ? 'required' : '' }}>

@endcomponent
