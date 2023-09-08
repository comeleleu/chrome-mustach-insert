let global_mustaches = [];
/*
Get image, detect and recognize faces, then update src image
*/

function processImages(images) {
  console.log("Processing imageSSSS");

  let tasks = Array.from(images).map((img) => {
    processImage(img);
  });

  Promise.all(tasks).then(async () => {
    setTimeout(() => {
      processImages(images);
    }, 1000);
  });
}

function processImage(node) {
  return new Promise((resolve, reject) => {
    if (node.getAttribute("data-stached") == "true") {
      resolve();
      return;
    }

    node.crossOrigin = "anonymous";
    node.onload = async function () {
      add_mustache(this).then(resolve);
    };
  });
}

function add_mustache(node) {
  return new Promise(async (resolve, reject) => {
    console.log("Adding mustache");
    if (node.getAttribute("data-stached") == "true") {
      resolve();
      return;
    }

    const canvas = faceapi.createCanvasFromMedia(node);
    // document.body.append(canvas);
    const displaySize = { width: node.width, height: node.height };
    faceapi.matchDimensions(canvas, displaySize);
    if (node.width < 1 || node.height < 1) {
      resolve();
      return;
    }

    const detections = await faceapi.detectAllFaces(node, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    if (resizedDetections[0] == undefined) {
      node.setAttribute("data-stached", true);
      resolve();
      return;
    }

    if (document.querySelectorAll("img[data-stached-ai]").length <= 3 && Math.floor(Math.random() * 100) < 5) {
      await replaceImage(node, resizedDetections);
    } else {
      await draw(node, resizedDetections);
    }

    resolve();
  });
}

async function replaceImage(img, resizedDetections) {
  var imageUrl = img.src;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    key: "DSZQGGaPcb3HdpexWRvxkP7rN7GrLIcwr6RErIW9AzLL7ezVQrS1r0clJd9g",
    prompt: "Add a mustach",
    negative_prompt: null,
    init_image: imageUrl,
    width: "512",
    height: "512",
    samples: "1",
    num_inference_steps: "30",
    safety_checker: "yes",
    enhance_prompt: "yes",
    guidance_scale: 7,
    strength: 0.3,
    seed: null,
    webhook: null,
    track_id: null,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://stablediffusionapi.com/api/v3/img2img", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      let json = JSON.parse(result);

      if (json.status == "success") {
        img.src = json.output[0];
        img.setAttribute("data-stached", true);
        img.setAttribute("data-stached-ai", true);
      }
      else {
        draw(img, resizedDetections);
      }
    })
    .catch(error => {
      console.log('error', error)
      draw(img, resizedDetections);
    });
}

function draw(img, resizedDetections) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);

    resizedDetections.forEach((face) => {
      var mustache = global_mustaches[Math.floor(Math.random() * global_mustaches.length)];
      const nose = face.landmarks._positions[33];
      const mustacheWidth = (face.landmarks._positions[54]._x - face.landmarks._positions[48]._x) * 2;
      const mouthAngle =
        Math.atan2(
          face.landmarks._positions[54]._x - face.landmarks._positions[48]._x,
          face.landmarks._positions[54]._y - face.landmarks._positions[48]._y
        ) +
        1.5 * Math.PI;
      const mustacheHeight = mustacheWidth / 3;

      context.save();
      context.translate(nose._x, nose._y);

      context.rotate(-mouthAngle);
      context.translate(-nose._x, -nose._y);

      context.drawImage(
        mustache,
        nose._x - mustacheWidth / 2,
        nose._y - mustacheHeight / 4,
        mustacheWidth,
        mustacheHeight
      );
      context.restore();
    });

    img.src = canvas.toDataURL();
    img.setAttribute("data-stached", true);
    img.onload = () => resolve();
  });
}

async function loadModels() {
  const model_url = chrome.extension.getURL("models");
  await faceapi.nets.tinyFaceDetector.loadFromUri(model_url); // Face detection algorithim - faster, but less accurate
  await faceapi.nets.faceRecognitionNet.loadFromUri(model_url); // Face recognition algorithim
  await faceapi.nets.faceLandmark68Net.loadFromUri(model_url); // Face landmarks algorithim
}

async function loadImage(image_url) {
  return new Promise((resolve, reject) => {
    const stach = chrome.runtime.getURL(image_url);

    var image = new Image();
    image.src = stach;
    image.onload = function (ev) {
      resolve(image);
    };
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
    loadImage("images/mustaches/mustache_5.png"),
  ]).then((val) => {
    global_mustaches = val;

    processImages(document.images)
  })
});
