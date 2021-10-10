<x-guest-layout>
    <div class="login">
        <h1>Log in</h1>

        <x-auth-session-status :status="session('status')" />
        <x-auth-validation-errors :errors="$errors" />

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <label>
                <span>{{ __('Email') }}</span>
                <input type="email" name="email" required autofocus autocomplete="email">
            </label>

            <label>
                <span>{{ __('Password') }}</span>
                <input type="password" name="password" required autocomplete="current-password">
            </label>

            <div class="call-to-action-bar">
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}" class="button-wrapper" tabindex="-1">
                        <button type="button">{{ __('Reset Password') }}</button>
                    </a>
                @endif
                <button type="submit">{{ __('Log in') }}</button>
            </div>
        </form>
    </div>
</x-guest-layout>
