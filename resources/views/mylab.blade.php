<x-app-layout bodyClass="{{ $bodyClass }}">
    <main>
        <section>
            <h1>Experiment Options</h1>
            <a href="{{ route('mylab.experiment.presentiment.1') }}">
                <div class="experiment option">
                    <h2>Dean Radin, PRNG</h2>
                    <p>Conduct the classic Dean Radin presentiment experiment with Pseudo Random Number Generator.</p>
                </div>
            </a>
            <a href="{{ route('mylab.experiment.presentiment.2') }}">
                <div class="experiment option">
                    <h2>Additional Control, PRNG</h2>
                    <p>
                        Skeptics and critics say that presentiment was an exercise in imagining a signal in noise. To
                        examine the merits of this claim, we can conduct a control experiment. It should demonstrate
                        whether or not this sketpical rebuff is correct or not.
                    </p>
                </div>
            </a>
        </section>
        <section>
            <h1>Results Analysis</h1>
            <a href="{{ route('mylab.experiment.presentiment.1&2.dataAnalysis') }}">
                <div class="experiment option">
                    <h2>Dean Radin, PRNG + Additional Control</h2>
                    <p>
                        Analyse Results from the Dean Radin presentiment experiment with Pseudo Random Number Generator.
                        Then look at how the additional control experiment data can be brought into that analysis.
                    </p>
                </div>
            </a>
        </section>
    </main>
</x-app-layout>
