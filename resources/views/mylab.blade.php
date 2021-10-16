<x-app-layout bodyClass="{{ $bodyClass }}">
    <main>
        <section>
            <h1>Experiment Options</h1>
            <a href="{{ route('mylab.experiment.presentiment.1') }}">
                <div class="experiment-option">
                    <h2>Dean Radin, PRNG</h2>
                    Conduct Classic Dean Radin Presentiment Experiment with Pseudorandom Number Generator
                </div>
            </a>
        </section>
        <section>
            <h1>Results Analysis</h1>
            <a href="">
                <div class="experiment-option">
                    <h2>Dean Radin, PRNG</h2>
                    Analyse Results From Dean Radin Presentiment Experiment with Pseudorandom Number Generator
                </div>
            </a>
        </section>
    </main>
</x-app-layout>
