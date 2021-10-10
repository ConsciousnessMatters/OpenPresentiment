<x-guest-layout>
    <div class="root">
        <header>
            <h1>Open<em>Presentiment</em></h1>
            <div class="version">0.4 alpha</div>
        </header>
        <div class="options">
            @auth
                <a href="{{ route('mylab') }}" class="button-wrapper" tabindex="-1""><button>MyLab</button></a>
            @else
                <a href="{{ route('login') }}" class="button-wrapper" tabindex="-1""><button>Log in</button></a>

                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="button-wrapper" tabindex="-1"" ><button>Register</button></a>
                @endif
            @endauth
            <a href="{{ route('opengsr') }}" class="button-wrapper" tabindex="-1""><button>OpenGSR</button></a>
        </div>
    </div>
</x-guest-layout>
