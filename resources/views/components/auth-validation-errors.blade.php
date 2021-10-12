@props(['errors'])

@if ($errors->any())
    <div class="validation-errors full-screen-alert">
        <h1>
            {{ __('Authentication Error') }}
        </h1>

        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>

        <button class="full-screen-alert-dismiss">Dismiss</button>
    </div>
@endif
