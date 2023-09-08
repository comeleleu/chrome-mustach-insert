let global_images = []
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

  if (document.querySelectorAll('img[data-stached-ai]').length <= 3 && Math.floor(Math.random() * 100) < 5) {
    replaceImage(node);
  } else {
    draw(node, resizedDetections)
  }
}

async function replaceImage(img) {
  var imageUrl = img.src;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
            
  var raw = JSON.stringify({
    "key": "DSZQGGaPcb3HdpexWRvxkP7rN7GrLIcwr6RErIW9AzLL7ezVQrS1r0clJd9g",
    "prompt": "Add a mustach on faces",
    "negative_prompt": null,
    "init_image": imageUrl,
    "width": "512",
    "height": "512",
    "samples": "1",
    "num_inference_steps": "200",
    "safety_checker": "yes",
    "enhance_prompt": "yes",
    "guidance_scale": 7,
    "strength": 0.3,
    "seed": null,
    "webhook": null,
    "track_id": null
  });
            
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
            
  fetch("https://stablediffusionapi.com/api/v3/img2img", requestOptions)
    .then(response => response.text())
    .then(result => {
      let json = JSON.parse(result);

      if (json.status == "success") {
        img.src = json.output[0];
        img.setAttribute("data-stached", true);
        img.setAttribute("data-stached-ai", true);
      }
      else if (json.status == "processing") {
        img.setAttribute("data-stached-ai-queue", "processing");
        console.log("sd processing");
        
        let i = 1;
        do {
          setTimeout(function(){
            
            raw = JSON.stringify({
              "key": "DSZQGGaPcb3HdpexWRvxkP7rN7GrLIcwr6RErIW9AzLL7ezVQrS1r0clJd9g",
              "request_id": json.id
            });
  
            fetch("https://stablediffusionapi.com/api/v3/img2img", requestOptions)
              .then(response => response.text())
              .then(result => {
                let json = JSON.parse(result);
                console.log(json);
  
                if (json.status == "success") {
                  img.src = json.output[0];
                  img.setAttribute("data-stached", true);
                  img.setAttribute("data-stached-ai", true);
                  img.setAttribute("data-stached-ai-queue", "done");
                }
              })
              .catch(error => console.log('error', error));
            img.setAttribute("data-stached-ai-queue", "processing-"+i);

          }, 1000 * i);
        } while (json.status != "success");
      }
    })
    .catch(error => console.log('error', error));

  // img.src = "https://cdn2.stablediffusionapi.com/generations/a8517009-d9ff-4b80-b07f-8271ded1ab28-0.png";
  // img.setAttribute("data-stached", true);
  // img.setAttribute("data-stached-ai", true);
}

async function draw(img, resizedDetections) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);

  resizedDetections.forEach((face) => {
    var mustache = global_images[Math.floor(Math.random() * global_images.length)];
    const nose = face.landmarks._positions[33];
    const mustacheWidth = (face.landmarks._positions[54]._x - face.landmarks._positions[48]._x) * 2;
    const mustacheHeight = mustacheWidth / 3;
    context.drawImage(mustache, nose._x - mustacheWidth / 2, nose._y - mustacheHeight / 4, mustacheWidth, mustacheHeight);
  })

  img.src = canvas.toDataURL()
  img.setAttribute("data-stached", true);
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
document.addEventListener("DOMContentLoaded", async function (event) {
  await loadModels();

  Promise.all([
    loadImage("images/mustaches/mustache_1.png"),
    loadImage("images/mustaches/mustache_2.png"),
    loadImage("images/mustaches/mustache_3.png"),
    loadImage("images/mustaches/mustache_4.png"),
    loadImage("images/mustaches/mustache_5.png")
  ]).then((val) => {
    global_images = val;

    setInterval(async () => {
      Array.from(document.images).forEach((img) => {
        processImage(img);
      });
    }, 1000);
  })

 
  // // observeMutations();
});