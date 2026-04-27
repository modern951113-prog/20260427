// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model. We remove the flip option so the keypoints
  // match the non-mirrored video feed, which is simpler to map.
  handPose = ml5.handPose();
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
  // Standard p5.js video capture
  video = createCapture(VIDEO);
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

  // Draw the hand landmarks, mapping them to the new video position and size
  for (let hand of hands) {
    if (hand.confidence > 0.1) {
      for (let keypoint of hand.keypoints) {
        // Map the keypoint from the original video dimensions to the new display dimensions
        const mappedX = map(keypoint.x, 0, video.width, x, x + videoTargetWidth);
        const mappedY = map(keypoint.y, 0, video.height, y, y + videoTargetHeight);

        if (hand.handedness == "Left") {
          fill(255, 0, 255);
        } else {
          fill(255, 255, 0);
        }
        noStroke();
        circle(mappedX, mappedY, 16);
      }
    }
  }
}

// Add a function to resize the canvas when the browser window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
      }
    }
  }
}
