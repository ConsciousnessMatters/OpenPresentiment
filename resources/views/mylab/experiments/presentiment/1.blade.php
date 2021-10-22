<x-app-layout bodyClass="{{ $bodyClass }}">
    <main>
        <form action="{{ route('mylab.experiment.presentiment.1.storeTrial') }}" name="ajax-info">
            @csrf
            <input type="hidden" name="user_id" value="{{ $user->id }}" />
        </form>
        <section class="experiment-structure">
            <span class="part part-1 current">Part 1, Experiment Introduction</span>
            <span class="part part-2">Part 2, Subject Selection</span>
            <span class="part part-3 not-yet">Part 3, Subject Agreement</span>
            <span class="part part-4 not-yet">Part 4, Start Experiment</span>
            <span class="part part-5 not-yet">Part 5, Thanks, Results & Further Information</span>
        </section>
        <section class="part part-1">
            <h1>1. Experiment 1, Dean Radin, PRNG</h1>
        </section>
        <section class="part part-2 hidden">
            <h1>2. Subject Selection</h1>
            <p>
                It's now time to select a subject. Please get their agreement first, they will be asked when they login
                for themselves to validate they took part in the experiment. They will be able to see live anonymised
                experimental data you collect when they login as a thank you for taking part.
            </p>
            <form action="{{ route('mylab.experiment.presentiment.1.searchUser') }}" method="post" name="ajax-search-user">
                @csrf
                <label>
                    <span>Subject user email address on OpenPresentiment:</span>
                    <div class="search-input-group">
                        <input type="email" name="subject-email"/>
                        <button>Search</button>
                    </div>
                </label>
                <div class="form-response">
                    <span class="success message hidden">Subject <span class="subject-number"></span> found. You may now proceed to part 3.</span>
                    <span class="failure message hidden">Unable to find subject, please feel free to try again.</span>
                </div>
            </form>
        </section>
        <section class="part part-3 hidden">
            <h1>3. Subject Agreement</h1>
            <p>
                By accepting this agreemnt you will become a crucial part of a team effort to help understand presentiment. Becoming part of
                this entails certain privileges and responsibilities.
            </p>
            <p>
                So would you like to do some earnest, honourable science or would you like to just have a play for now?
            </p>
            <div class="call-to-action-bar">
                <button id="subject-agreement-accepted">Do Science</button><button id="subject-agreement-rejected" class="neutral">Play Around</button>
            </div>
        </section>
        <section class="part part-4 hidden">
            <h1>4. Start Experiment</h1>
            <canvas class="open-gsr"></canvas>
            <p>We'll need confirmation that the GSR is online and working before trials begin.</p>

            <div>
                <button id="connect-to-gsr">Connect To GSR</button><button id="begin-trials" class="neutral" disabled>Start Experiment</button>
            </div>

            <div class="full-screen-interaction hidden" id="trials-container">
                <div class="phase" id="phase-1">
                    <span>Click the button or press space bar to continue when you're ready.</span>
                    {{--Task reminder. Why this matters.--}}
                    <span>Trial <span class="trial-number"></span> of <span class="trial-totals"></span></span>
                    <button id="goto-phase-2">Ready</button>
                </div>
                <div class="phase hidden" id="phase-2">
                    <canvas id="experimental-core"></canvas>
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
