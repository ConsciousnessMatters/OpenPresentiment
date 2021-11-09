<x-app-layout bodyClass="{{ $bodyClass }}">
    <main>
        <span class="status-message"></span>
        <canvas id="results-plotter"></canvas>
        <form action="{{ route('mylab.experiment.presentiment.1&2.getExperimentList') }}" name="ajax-list">
            @csrf
            <input type="hidden" name="user_id" value="{{ $user->id }}" />
        </form>
    </main>
    <section class="controls">
        <div></div>
        <div>
            <h3>My Experiments</h3>
            <ul class="experiments">
                <li class="template-item" data-load-experiment="">
                    Experiment #<span class="experiment-number"></span>
                    <button>Load Data</button>
                </li>
            </ul>
        </div>
    </section>
</x-app-layout>
