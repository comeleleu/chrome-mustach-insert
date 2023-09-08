const luc = document.getElementById("luc");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/facial-recognition-test/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/facial-recognition-test/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/facial-recognition-test/models"),
]).then();

checkFace();
console.log(luc.complete);
function checkFace() {
  console.log("checkFace");
  const canvas = faceapi.createCanvasFromMedia(luc);
  document.body.append(canvas);
  const displaySize = { width: luc.width, height: luc.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(luc, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    console.log(resizedDetections[0].landmarks);
    const nose = resizedDetections[0].landmarks._positions[33];
    const mustacheWidth =
      (resizedDetections[0].landmarks._positions[54]._x - resizedDetections[0].landmarks._positions[48]._x) * 2;
    const mustacheHeight = mustacheWidth / 3;
    console.log(mustacheWidth);

    var image = new Image();
    image.src = "/facial-recognition-test/images/new_mustache.png";
    image.onload = function (ev) {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, nose._x - mustacheWidth / 2, nose._y - mustacheHeight / 4, mustacheWidth, mustacheHeight);
    };
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }, 1000);
}
