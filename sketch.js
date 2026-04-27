// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let bubbles = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // Use the full window for the canvas
  createCanvas(windowWidth, windowHeight);
  // Create a video capture with the flipped option to match the model
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Set the background color as requested
  background('#e7c6ff');

  // Calculate the desired width and height (50% of the canvas)
  let videoTargetWidth = width * 0.5;
  let videoTargetHeight = height * 0.5;

  // Calculate position to center the video
  let x = (width - videoTargetWidth) / 2;
  let y = (height - videoTargetHeight) / 2;

  // Draw the video feed in the center
  image(video, x, y, videoTargetWidth, videoTargetHeight);

  // 更新並繪製水泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    // 讓水泡向上移動並帶有一點搖晃效果
    b.y -= b.speed;
    b.x += random(-1, 1);
    b.lifespan -= 1.5; // 生命週期減少

    // 繪製水泡
    push();
    noFill();
    stroke(255, 255, 255, b.lifespan); // 隨著上升，水泡會漸漸變透明
    strokeWeight(2);
    ellipse(b.x, b.y, b.size);
    pop();

    // 如果生命週期結束，就移除水泡
    if (b.lifespan < 0) {
      bubbles.splice(i, 1);
    }
  }

  // Loop through all the detected hands
  for (let hand of hands) {
    // Check if the hand detection confidence is high enough
    if (hand.confidence > 0.1) {
      // Map all keypoints to the canvas coordinates first
      const mappedKeypoints = hand.keypoints.map(keypoint => ({
        x: map(keypoint.x, 0, video.width, x, x + videoTargetWidth),
        y: map(keypoint.y, 0, video.height, y, y + videoTargetHeight)
      }));

      // 定義指尖的關節點編號
      const fingertips = [4, 8, 12, 16, 20];
      for (const index of fingertips) {
        // 有一定機率在指尖產生新的水泡
        if (random(1) < 0.2) {
          const fingertip = mappedKeypoints[index];
          const bubble = {
            x: fingertip.x, y: fingertip.y,
            size: random(20, 40), speed: random(1, 4), lifespan: 150
          };
          bubbles.push(bubble);
        }
      }

      // Set color based on handedness
      let handColor;
      if (hand.handedness == "Left") {
        handColor = color(255, 0, 255); // Magenta for Left
      } else {
        handColor = color(255, 255, 0); // Yellow for Right
      }

      // Define the connections for the fingers
      const fingerSegments = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
        [17, 18, 19, 20],
      ];

      // Draw lines connecting the keypoints
      stroke(handColor);
      strokeWeight(4);
      for (const segment of fingerSegments) {
        for (let i = 0; i < segment.length - 1; i++) {
          const startPoint = mappedKeypoints[segment[i]];
          const endPoint = mappedKeypoints[segment[i + 1]];
          line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
        }
      }

      // Draw keypoints as circles on top of the lines
      noStroke();
      fill(handColor);
      for (const keypoint of mappedKeypoints) {
        circle(keypoint.x, keypoint.y, 16);
      }
    }
  }

  // 最後在所有元素的頂層繪製置中文字
  push();
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(255); // 白色文字
  stroke(0); // 黑色外框
  strokeWeight(3);
  text("414730407 陳OO", width / 2, height * 0.125);
  pop();
}

// Add a function to resize the canvas when the browser window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
