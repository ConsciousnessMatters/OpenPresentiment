<nav>
    <div class="ident">
        <div>
            <span>Open<em>Presentiment</em></span>
            <span class="version">0.6 alpha</span>
        </div>
    </div>

    <div class="page-title">
        <a href="{{ route('mylab') }}">MyLab</a>
        <span class="smaller">
            <span class="seperator">></span>
            <a href="{{ route('mylab.experiment.presentiment.1') }}">Presentiment Experiment 1</a>
        </span>
    </div>

    <form class="further-options" method="POST" action="{{ route('logout') }}">
        @csrf

        <a href="{{ route('mylab.setup') }}">
            <button type="button" class="neutral">{{ __('Setup') }}</button>
        </a>
        <a href="{{ route('logout') }}"
           onclick="event.preventDefault(); this.closest('form').submit(); ">
            <button type="button" class="neutral">{{ __('Log Out') }}</button>
        </a>
    </form>
</nav>
