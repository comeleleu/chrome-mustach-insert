let global_mustaches = []
/*
Get image, detect and recognize faces, then update src image
*/

function processImages(images) {

  console.log("Processing imageSSSS")

  let tasks = Array.from(images).map((img) => {
    processImage(img);
  })

  Promise.all(tasks).then(async () => {
    setTimeout(() => { 
      processImages(images)
    }, 1000)
  })
}

function processImage(node) {
  return new Promise((resolve, reject) => {
    if (node.getAttribute("data-stached") == "true") {
      resolve();
      return
    }

    node.crossOrigin = "anonymous";
    node.onload = async function () {
      add_mustache(this).then(resolve);
    };
  });
}

function add_mustache(node) {
  return new Promise(async (resolve, reject) => {
    console.log("Adding mustache")
    if (node.getAttribute("data-stached") == "true") { resolve(); return }

    const canvas = faceapi.createCanvasFromMedia(node);
    // document.body.append(canvas);
    const displaySize = { width: node.width, height: node.height };
    faceapi.matchDimensions(canvas, displaySize);
    if (node.width < 1 || node.height < 1) { resolve(); return }

    const detections = await faceapi.detectAllFaces(node, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    if (resizedDetections[0] == undefined) {
      node.setAttribute("data-stached", true);
      resolve()
      return
    }

    await draw(node, resizedDetections)
    resolve()
  });
}

function draw(img, resizedDetections) {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    resizedDetections.forEach((face) => {
      var mustache = global_mustaches[Math.floor(Math.random() * global_mustaches.length)];
      const nose = face.landmarks._positions[33];
      const mustacheWidth = (face.landmarks._positions[54]._x - face.landmarks._positions[48]._x) * 2;
      const mustacheHeight = mustacheWidth / 3;
      context.drawImage(mustache, nose._x - mustacheWidth / 2, nose._y - mustacheHeight / 4, mustacheWidth, mustacheHeight);
    })

    img.src = canvas.toDataURL()
    img.setAttribute("data-stached", true);
    img.onload = () => resolve()
  })
}

async function loadModels() {
  const model_url = chrome.extension.getURL("models");
  await faceapi.nets.tinyFaceDetector.loadFromUri(model_url); // Face detection algorithim - faster, but less accurate
  await faceapi.nets.faceRecognitionNet.loadFromUri(model_url); // Face recognition algorithim
  await faceapi.nets.faceLandmark68Net.loadFromUri(model_url); // Face landmarks algorithim
}

async function loadImage(image_url) {
  return new Promise((resolve, reject) => {
    const stach = chrome.runtime.getURL(image_url)

    var image = new Image();
    image.src = stach;
    image.onload = function (ev) {
      resolve(image);
    }
  });
}

// Entry point
// document.addEventListener("DOMContentLoaded", async function (event) {
//   await loadModels();

//   Promise.all([
//     loadImage("images/mustaches/mustache_1.png"),
//     loadImage("images/mustaches/mustache_2.png"),
//     loadImage("images/mustaches/mustache_3.png"),
//     loadImage("images/mustaches/mustache_4.png"),
//     loadImage("images/mustaches/mustache_5.png")
//   ]).then((val) => {
//     global_mustaches = val;

//     // setInterval(async () => {
//     //   Array.from(document.images).forEach((img) => {
//     //     processImage(img);
//     //   });
//     // }, 1000);
//     console.log("Salut")
//     processImages(document.images)
//     // setTimeout(() => processImages(document.images), 1000)
//   })

 
//   // // observeMutations();
// });

window.addEventListener("load", async () => {
  await loadModels();

  Promise.all([
    loadImage("images/mustaches/mustache_1.png"),
    loadImage("images/mustaches/mustache_2.png"),
    loadImage("images/mustaches/mustache_3.png"),
    loadImage("images/mustaches/mustache_4.png"),
    loadImage("images/mustaches/mustache_5.png")
  ]).then((val) => {
    global_mustaches = val;

    console.log("Salut")
    processImages(document.images)
  })
});