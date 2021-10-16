<x-app-layout bodyClass="{{ $bodyClass }}">
    <main>
        <section class="experiment-structure">
            <span class="part part-1 current">Part 1, Experiment Introduction</span>
            <span class="part part-2">Part 2, Subject Selection</span>
            <span class="part part-3 not-yet">Part 3, Subject Agreement</span>
            <span class="part part-4 not-yet">Part 4, Trials</span>
            <span class="part part-5 not-yet">Part 5, Thanks, Results & Further Information</span>
        </section>
        <section class="part part-1">
            <h1>Experiment 1, Dean Radin, PRNG</h1>
        </section>
        <section class="part part-2 hidden">
            <h1>Part 2</h1>
        </section>
        <section class="part part-3 hidden">
            <h1>Part 3</h1>
        </section>
        <section class="part part-4 hidden">
            <h1>Part 4</h1>
            <p>We'll need confirmation that the GSR is online and working before trials begin.</p>

            <button type="button">Start</button>

            <div class="trials hidden">
                <div>
                    Click the button or press space to continue when you're ready.
                    Progress: 1 of 16
                </div>
                <div>
                    T -7
                </div>
                <div>
                    Show Picture
                </div>
                <div>
                    T +10
                </div>
                <div>
                    T +10
                </div>

                <div>
                    End only: Trials Complete
                </div>
            </div>
        </section>
        <section class="part part-5 hidden">
            <h1>Part 5</h1>
        </section>
    </main>
</x-app-layout>
