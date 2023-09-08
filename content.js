/*
Get image, detect and recognize faces, then update src image
*/
function processImage(node) {
  if (node.getAttribute("data-stached") == "true") { return }

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

async function add_mustache(node) {
  if (node.getAttribute("data-stached") == "true") { return }
  const canvas = faceapi.createCanvasFromMedia(node);
  // document.body.append(canvas);
  const displaySize = { width: node.width, height: node.height };
  faceapi.matchDimensions(canvas, displaySize);

  const detections = await faceapi.detectAllFaces(node, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  if (resizedDetections[0] == undefined) {
    node.setAttribute("data-stached", true);
    return
  }

  draw(node, resizedDetections)
}

async function draw(img, resizedDetections) {
  const stach = chrome.runtime.getURL("images/mustaches/mustache_1.png")

  var image = new Image();
  image.src = stach;

  image.onload = function (ev) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    resizedDetections.forEach((face) => {
      const nose = face.landmarks._positions[33];
      const mustacheWidth = (face.landmarks._positions[54]._x - face.landmarks._positions[48]._x) * 2;
      const mustacheHeight = mustacheWidth / 3;
      context.drawImage(image, nose._x - mustacheWidth / 2, nose._y - mustacheHeight / 4, mustacheWidth, mustacheHeight);
    })

    img.src = canvas.toDataURL()
    img.setAttribute("data-stached", true);
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

  setInterval(async () => {
    Array.from(document.images).forEach((img) => {
      processImage(img);
    });
  }, 1000);
  // observeMutations();
});