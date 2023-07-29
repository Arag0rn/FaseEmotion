

const video = document.getElementById('video');
const emojiContainer = document.getElementById('emojiContainer'); 

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
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
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

async function getCurrentEmotion(video) {
  let expressions = (await faceapi.detectSingleFace(video).withFaceExpressions()).expressions;
  let resultExpression = 'neutral'

 
  for (let key in expressions) {
    let value = expressions[key]

    if (value > expressions[resultExpression]) {
      resultExpression = key
    }
  }
  return resultExpression;
}


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    let emotion = await getCurrentEmotion(video)
    if (emotion !== 'neutral') {
      emojiContainer.innerHTML = emojiMap[emotion];
    } else {
      emojiContainer.innerHTML = '';
    }
  }, 100);
});