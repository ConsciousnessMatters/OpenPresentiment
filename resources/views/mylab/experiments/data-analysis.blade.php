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
        <div class="experiment-listing">
            <h3>My Experiments</h3>
            <ul class="experiments">
                <li class="template-item" data-experiment-id="">
                    <div class="data">
                        <h4>Experiment #<span class="experiment-number">?</span></h4>
                        <ul>
                            <li>Started at: <span class="experiment-date-time">?</span></li>
                            <li>Subject #<span class="subject-number">?</span>
                                <ul>
                                    <li>Name: <span class="subject-name">?</span></li>
                                    <li>Email: <span class="subject-email">?</span></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="controls">
                        <button class="load">Load Data To Graph</button>
                        <button class="remove hidden">Remove Data From Graph</button>
                        <button class="show-averages">Show Averages On Graph</button>
                        <button class="remove-averages hidden">Remove Averages From Graph</button>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</x-app-layout>
