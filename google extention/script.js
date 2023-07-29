const video = document.getElementById('video');
const emojiContainer = document.getElementById('emojiContainer'); // Элемент, куда будет выводиться эмодзи

const emojiMap = {
  neutral: '😐',
  happy: '😄',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  disgusted: '🤢',
  fearful: '😨'
};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo() {
  try {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        video.srcObject = stream;
      })
      .catch(err => console.error("Error accessing the camera: ", err));
  } catch {
    console.error("getUserMedia is not available");
  }
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // Выводим эмодзи, если обнаружено не нейтральное выражение
    emojiContainer.innerHTML = '';
    resizedDetections.forEach((detection) => {
      const expressions = detection.expressions;
      const detectedEmotions = Object.keys(expressions).map((emotion) => {
        return { emotion: emotion, value: expressions[emotion] };
      });
      detectedEmotions.forEach((emotion) => {
        if (emotion.emotion !== 'neutral' && emotion.value > 0.5) {
          const emoji = emojiMap[emotion.emotion];
          if (emoji) {
            emojiContainer.innerHTML += emoji;
          }
        }
      });
    });
  }, 100);
});


console.log("2q3213rtf2efg2efg23eg2erg2tg2g");