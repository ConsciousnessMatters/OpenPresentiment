let canvasEmotional,
    canvasPeaceful,
    contextEmotional,
    contextPeaceful,
    emotionalImage,
    peacefulImage;

self.onmessage = function(event) {
    switch (event.data.instruction) {
        case 'initialise':
            initialise(event);
            break;
        case 'loadImages':
            loadImages(event);
            break;
        case 'sendEmotionalImage':
            sendImage(event, canvasEmotional);
            break;
        case 'sendPeacefulImage':
            sendImage(event, canvasPeaceful);
            break;
    }
}

function initialise(event) {
    canvasEmotional = event.data.canvasOne;
    canvasPeaceful = event.data.canvasTwo;
    contextEmotional = canvasEmotional.getContext('2d');
    contextPeaceful = canvasPeaceful.getContext('2d');
}

function sendImage(event, canvas) {
    const bitmap = canvas.transferToImageBitmap();
    self.postMessage({ instruction: 'render', bitmap });
}

async function loadImages(event) {
    const emotionalImageBlob = await fetch(event.data.emotionalImageURL).then(result => result.blob());
    const peacefulImageBlob = await fetch(event.data.peacefulImageURL).then(result => result.blob());

    emotionalImage = await createImageBitmap(emotionalImageBlob);
    peacefulImage = await createImageBitmap(peacefulImageBlob);

    drawImageOnCanvas(emotionalImage, contextEmotional);
    drawImageOnCanvas(peacefulImage, contextPeaceful);
}

function drawImageOnCanvas(image, context) {
    const originalWidth = image.width,
        originalHeight = image.height,
        imageWidthIfCanvasHeight = originalWidth * (context.canvas.height / originalHeight),
        imageHeightIfCanvasWidth = originalHeight * (context.canvas.width / originalWidth),
        constrainWidth = imageWidthIfCanvasHeight > context.canvas.width,
        calculatedWidth = constrainWidth ? context.canvas.width : imageWidthIfCanvasHeight,
        calculatedHeight = constrainWidth ? imageHeightIfCanvasWidth : context.canvas.height,
        imageLocationX = (context.canvas.width / 2) - (calculatedWidth / 2),
        imageLocationY = (context.canvas.height / 2) - (calculatedHeight / 2);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.drawImage(image, imageLocationX, imageLocationY, calculatedWidth, calculatedHeight);
}