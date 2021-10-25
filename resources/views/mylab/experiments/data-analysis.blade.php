<x-app-layout bodyClass="{{ $bodyClass }}">
    <main>
        <span class="status-message"></span>
        <canvas id="results-plotter"></canvas>
        <form action="{{ route('mylab.experiment.presentiment.1&2.getData') }}" name="ajax">
            @csrf
            <input type="hidden" name="user_id" value="{{ $user->id }}" />
        </form>
    </main>
</x-app-layout>
