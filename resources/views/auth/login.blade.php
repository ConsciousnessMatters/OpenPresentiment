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

            <label>
                <span>{{ __('Remember me') }}</span>
                <input id="remember_me" type="checkbox" name="remember">
            </label>

            @if (Route::has('password.request'))
                <a class="underline text-sm text-gray-600 hover:text-gray-900" href="{{ route('password.request') }}">
                    {{ __('Forgot your password?') }}
                </a>
            @endif

            <div class="call-to-action-bar">
                <button type="submit">{{ __('Log in') }}</button>
            </div>
        </form>
    </div>
</x-guest-layout>
