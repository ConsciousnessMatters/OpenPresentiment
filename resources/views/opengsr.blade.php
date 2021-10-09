<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>OpenPresentiment</title>
    <meta name="description" content="Software to allow anyone to replicate Dean Radin's presentiment experiments.">
    <meta name="author" content="Matthew Riddle, Consciousness Matters">

    <!-- Copy out to static to enhance privacy - BEGIN -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <!-- Copy out to static to enhance privacy - END -->

    <link rel="stylesheet" href="css/styles.css?v=1.0">
</head>
<body>
<div id="setup">
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
</body>
</html>
