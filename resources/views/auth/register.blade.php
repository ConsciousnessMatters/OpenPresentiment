<x-guest-layout>
    <div class="register">
        <h1>Register</h1>

        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <label>
                <span>{{ __('Name') }}</span>
                <input type="text" name="name" required autocomplete="email">
            </label>

            <label>
                <span>{{ __('Email') }}</span>
                <input type="email" name="email" required autocomplete="email">
            </label>

            <label>
                <span>{{ __('Password') }}</span>
                <input type="password" name="password" required autocomplete="new-password">
            </label>

            <label>
                <span>{{ __('Confirm Password') }}</span>
                <input type="password" name="password_confirmation" required autocomplete="new-password">
            </label>

            <div class="call-to-action-bar">
                <a href="{{ route('login') }}" class="button-wrapper" tabindex="-1">
                    <button type="button">{{ __('Already registered?') }}</button>
                </a>

                <button type="submit">{{ __('Register') }}</button>
            </div>
        </form>
    </div>
</x-guest-layout>
