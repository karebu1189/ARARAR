// MediapipeのHandsとCameraを読み込む
import { Hands } from 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1635982362/hands.js';
import { Camera } from 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.4.1635982362/camera_utils.js';

const video = document.getElementById('camera');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Canvasサイズをウィンドウに合わせる
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 赤い四角オブジェクト
let obj = { x: canvas.width/2, y: canvas.height/2, size: 50 };

// Mediapipe Hands初期化
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1635982362/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

// 手の位置を取得して赤い四角を移動
hands.onResults(results => {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const hand = results.multiHandLandmarks[0];
    const indexFinger = hand[8]; // 人差し指先
    obj.x = indexFinger.x * canvas.width;
    obj.y = indexFinger.y * canvas.height;
  }
});

// カメラ起動
const cameraInstance = new Camera(video, {
  onFrame: async () => { await hands.send({ image: video }); },
  width: 1280,
  height: 720
});
cameraInstance.start();

// ゲームループ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 赤い四角描画
  ctx.fillStyle = 'rgba(255,0,0,0.7)';
  ctx.fillRect(obj.x - obj.size/2, obj.y - obj.size/2, obj.size, obj.size);

  requestAnimationFrame(gameLoop);
}
gameLoop();
