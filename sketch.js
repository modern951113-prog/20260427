// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

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

  // Loop through all the detected hands
  for (let hand of hands) {
    // Check if the hand detection confidence is high enough
    if (hand.confidence > 0.1) {
      // Loop through all the keypoints of the hand
      for (let keypoint of hand.keypoints) {
        // The keypoint coordinates are relative to the original video dimensions.
        // We need to map them to the new position and size of the video on the canvas.
        const mappedX = map(keypoint.x, 0, video.width, x, x + videoTargetWidth);
        const mappedY = map(keypoint.y, 0, video.height, y, y + videoTargetHeight);

        // Color-code based on whether it's a left or right hand
        if (hand.handedness == "Left") {
          fill(255, 0, 255); // Magenta for Left
        } else {
          fill(255, 255, 0); // Yellow for Right
        }
        
        noStroke();
        // Draw a circle at the mapped keypoint position
        circle(mappedX, mappedY, 16);
      }
    }
  }
}

// Add a function to resize the canvas when the browser window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
