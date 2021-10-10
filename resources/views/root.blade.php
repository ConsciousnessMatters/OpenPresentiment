<x-guest-layout>

    <div>
        @auth
            <a href="{{ route('mylab') }}">MyLab</a>
        @else
            <a href="{{ route('login') }}">Log in</a>

            @if (Route::has('register'))
                <a href="{{ route('register') }}" >Register</a>
            @endif
        @endauth
    </div>
</x-guest-layout>
