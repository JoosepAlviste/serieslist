<div class="field">
    <div class="file has-name is-fullwidth">
        <label class="file-label">
            <input type="file" class="file-input" name="{{ $name }}" id="{{ $name }}">
            <span class="file-cta">
                <span class="file-icon">
                    <i class="fa fa-upload"></i>
                </span>
                <span class="file-label">
                    {{ $slot }}
                </span>
            </span>
            <span class="file-name" id="{{ $name }}-file-name"></span>
        </label>
    </div>
</div>
