const video = document.getElementById("video");
const luc = document.getElementById("luc");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/facial-recognition-test/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/facial-recognition-test/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/facial-recognition-test/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/facial-recognition-test/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.log("oops")
  );
}
if (luc) {
  if (luc.complete) {
    checkFace();
  }
}

function checkFace() {
  const canvas = faceapi.createCanvasFromMedia(luc);
  document.body.append(canvas);
  const displaySize = { width: luc.width, height: luc.height };
  faceapi.matchDimensions(canvas, displaySize); 
  
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(luc, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const nose = detections[0].landmarks._positions[33];

    var image = new Image();
    image.src = "/facial-recognition-test/images/new_mustache.png";
    image.onload = function(ev) {
       var ctx = canvas.getContext('2d');
       ctx.drawImage(image, (nose._x/2)-30, nose._y/2, 60, 22);
    }

    // const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // console.log(resizedDetections);
    // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 1000);
}

// video.addEventListener("play", () => {
//   const canvas = faceapi.createCanvasFromMedia(video);
//   document.body.append(canvas);
//   const displaySize = { width: video.width, height: video.height };
//   faceapi.matchDimensions(canvas, displaySize);
//   setInterval(async () => {
//     const detections = await faceapi
//       .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks()
//       .withFaceExpressions();
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);
//     canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//     faceapi.draw.drawDetections(canvas, resizedDetections);
//     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//     faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//   }, 100);
// });
