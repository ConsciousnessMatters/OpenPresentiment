<x-guest-layout bodyClass="{{$bodyClass}}">
    <div class="please-verify-email">
        <h1>Email Verification</h1>

        <div class="email-verification-message">
            {{ __("In order to get the best quality experimental data, we need you to verify your email address by clicking on the link we just emailed to you. If you have problems receiving the email, we can always send you another.") }}
        </div>

        @if (session('status') == 'verification-link-sent')
            <div class="new-verification-link-sent">
                {{ __('A new verification link has been sent to the email address you provided during registration.') }}
            </div>
        @endif

        <div class="call-to-action-bar">
            <form method="POST" action="{{ route('verification.send') }}">
                @csrf

                <button type="submit">
                    {{ __('Resend Verification Email') }}
                </button>
            </form>

            <form method="POST" action="{{ route('logout') }}">
                @csrf

                <button type="submit">
                    {{ __('Log Out') }}
                </button>
            </form>
        </div>

    </div>
</x-guest-layout>
