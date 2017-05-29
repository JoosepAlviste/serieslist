<div class="field {{ isset($fieldClass) ? $fieldClass : '' }}">
    <label for="{{ $name }}" class="label {{ $required ? 'is-required' : '' }}">
        {{ $label }}
    </label>

    <p class="control {{ $errors->has($name) ? 'has-icon has-icon-right' : '' }}">

        {{ $slot }}

        @if ($errors->has($name))
            <span class="icon is-small">
                <i class="fa fa-warning"></i>
            </span>

            <span class="help is-danger">
                {{ $errors->first($name) }}
            </span>
        @endif
    </p>
</div>
