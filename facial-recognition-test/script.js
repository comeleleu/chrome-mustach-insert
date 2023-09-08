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
    (err) => console.error(err)
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
    console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    console.log(resizedDetections);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
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
