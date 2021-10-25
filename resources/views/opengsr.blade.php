<x-guest-layout bodyClass="{{ $bodyClass }}">
    <header>
        <h1>Open<em>GSR</em> <span class="version">1.0 beta</span></h1>
        <div class="connect">
            <button class="connect">Connect to Arduino</button>
            <a href="/" class="button-wrapper" tabindex="-1"><button class="goBackHome">OpenPresentiment</button></a>
        </div>
        <div class="connection-progress hidden"></div>
        <div class="options hidden">
            <button class="clearData">Clear Data</button>
            <button class="exportData">Export Data (CSV)</button>
            <a href="/" class="button-wrapper" tabindex="-1"><button class="goBackHome">OpenPresentiment</button></a>
        </div>
    </header>

    <canvas id="graph"></canvas>
    <div class="axis-x-label hidden">Time in seconds (s)</div>
    <div class="axis-y-label hidden">Voltage in millivolts (mV)</div>
    <script src="js/serial-data-service.js"></script>
    <script src="js/graph.js"></script>
    <script src="js/script.js"></script>
</x-guest-layout>
