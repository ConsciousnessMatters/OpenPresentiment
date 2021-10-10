<x-guest-layout>
    <div class="open-gsr">
        <h1>Open<em>Presentiment</em> <span class="version">0.3 α1</span></h1>

        <div class="connect">
            <button id="connect">Connect to Arduino</button>
        </div>
        <div class="options hidden">
            <button id="participate">Participate</button>
            <button id="clearData">Clear Data</button>
            <button id="exportData">Export Data</button>
        </div>

        <canvas id="graph"></canvas>
        <div class="axis-x-label hidden">Time in seconds (s)</div>
        <div class="axis-y-label hidden">Voltage in millivolts (mV)</div>
    </div>
    <script src="js/serialDataHandler.js"></script>
    <script src="js/graph.js"></script>
    <script src="js/script.js"></script>
</x-guest-layout>
