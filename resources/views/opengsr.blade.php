<x-guest-layout>
    <div class="open-gsr">
        <header>
            <h1>Open<em>GSR</em> <span class="version">1.0 beta</span></h1>
            <div class="connect">
                <button class="connect">Connect to Arduino</button>
                <a href="/" class="button-wrapper" tabindex="-1"><button class="goBackHome">Go Back Home</button></a>
            </div>
            <div class="options hidden">
                <button class="clearData">Clear Data</button>
                <button class="exportData">Export Data (CSV)</button>
                <a href="/" class="button-wrapper" tabindex="-1"><button class="goBackHome">Go Back Home</button></a>
            </div>
        </header>

        <canvas id="graph"></canvas>
        <div class="axis-x-label hidden">Time in seconds (s)</div>
        <div class="axis-y-label hidden">Voltage in millivolts (mV)</div>
    </div>
    <script src="js/serialDataHandler.js"></script>
    <script src="js/graph.js"></script>
    <script src="js/script.js"></script>
</x-guest-layout>
