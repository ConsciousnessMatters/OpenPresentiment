if ("serial" in navigator) {
    console.debug('Browser supports Web Serial API');
} else {
    alert('Browser currently unsupported, try updating your browser.');
}

var port = null;

async function connect()
{
    port = await navigator.serial.requestPort();
    await port.open({ baudrate: 9600 });
    console.debug('Connected');
}



document.getElementById('connect').addEventListener('click', () => {
    connect();
    console.debug('Connect function called.');

    // navigator.serial.requestPort().then((port) => {
    //     // Connect to `port` or add it to the list of available ports.
    // }).catch((e) => {
    //     // The user didn't select a port.
    // });
});





navigator.serial.addEventListener('connect', (e) => {
    // Connect to `e.target` or add it to a list of available ports.
});

navigator.serial.addEventListener('disconnect', (e) => {
    // Remove `e.target` from the list of available ports.
});

navigator.serial.getPorts().then((ports) => {
    // Initialize the list of available ports with `ports` on page load.
});


