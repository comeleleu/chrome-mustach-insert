
String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/*
Get image, detect and recognize faces, then update src image
*/
function processImage(node) {
  node.crossOrigin = "anonymous";
  if (node.complete) {
    f = async () => add_mustache(node)
    f();
  } else {
    node.onload = async function () {
      add_mustache(this);
    };
  }
}

function add_mustache(node) {
  const canvas = faceapi.createCanvasFromMedia(node);
  document.body.append(canvas);
  const displaySize = { width: node.width, height: node.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(node, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    if (resizedDetections[0] == undefined) { return }

    draw(node, resizedDetections[0].landmarks)
  }, 1000);
}

function draw(img, landmarks) {
  const nose = landmarks._positions[33];
  const mustacheWidth = (landmarks._positions[54]._x - landmarks._positions[48]._x) * 2;
  const mustacheHeight = mustacheWidth / 3;

  const stach = chrome.runtime.getURL("images/mustaches/mustache_1.png")

  var image = new Image();
  image.src = stach;

  image.onload = function (ev) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    context.drawImage(image, nose._x - mustacheWidth / 2, nose._y - mustacheHeight / 4, mustacheWidth, mustacheHeight);
    img.src = canvas.toDataURL()
  }
}

async function loadModels() {
  const model_url = chrome.extension.getURL("models");
  await faceapi.nets.tinyFaceDetector.loadFromUri(model_url); // Face detection algorithim - faster, but less accurate
  await faceapi.nets.faceRecognitionNet.loadFromUri(model_url); // Face recognition algorithim
  await faceapi.nets.faceLandmark68Net.loadFromUri(model_url); // Face landmarks algorithim
}


// Entry point
document.addEventListener("DOMContentLoaded", async function (event) {
  await loadModels();

  Array.from(document.images).forEach((img) => {
    processImage(img);
  });

  // observeMutations();
});