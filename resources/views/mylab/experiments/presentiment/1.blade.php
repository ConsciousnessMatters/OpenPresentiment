<x-app-layout bodyClass="{{ $bodyClass }}">
    <main>
        <section class="experiment-structure">
            <span class="part part-1 current">Part 1, Experiment Introduction</span>
            <span class="part part-2">Part 2, Subject Selection</span>
            <span class="part part-3 not-yet">Part 3, Subject Agreement</span>
            <span class="part part-4 not-yet">Part 4, Start Experiment</span>
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
            <canvas class="open-gsr"></canvas>
            <p>We'll need confirmation that the GSR is online and working before trials begin.</p>

            <div>
                <button id="connect-to-gsr">Connect To GSR</button><button id="begin-trials" class="neutral">Start Experiment</button>
            </div>

            <div class="full-screen-interaction hidden" id="trials-container">
                <div class="phase" id="phase-1">
                    <span>Click the button or press space bar to continue when you're ready.</span>
                    {{--Task reminder. Why this matters.--}}
                    <span>Trial <span class="trial-number"></span> of <span class="trial-totals"></span></span>
                    <button id="goto-phase-2">Ready</button>
                </div>
                <div class="phase hidden" id="phase-2">
                    <div class="timer">
                        <span>T </span><span class="value"></span>
                    </div>
                </div>
                <div class="phase hidden" id="phase-3">
                </div>
                <div class="phase hidden" id="phase-4">
                    <div class="timer">
                        <span>T </span><span class="value"></span>
                    </div>
                </div>
                <div class="phase hidden" id="end">
                    <span>Experiment Complete</span>
                    <span>Thank you for helping us figure out what's going on.</span>
                    <button id="goto-part-5">See Results & More</button>
                </div>
            </div>
        </section>
        <section class="part part-5 hidden">
            <h1>Part 5</h1>
        </section>
    </main>
</x-app-layout>
