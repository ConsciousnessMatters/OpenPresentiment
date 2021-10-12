<nav>
    <div class="ident">
        <div>
            <span>Open<em>Presentiment</em></span>
            <span class="version">0.4 alpha</span>
        </div>
    </div>

    <div class="page-title">
        MyLab
    </div>

    <form class="further-options" method="POST" action="{{ route('logout') }}">
        @csrf

        <a href="{{ route('logout') }}"
           onclick="event.preventDefault(); this.closest('form').submit(); ">
            <button type="button" class="neutral">{{ __('Log Out') }}</button>
        </a>
    </form>
</nav>
