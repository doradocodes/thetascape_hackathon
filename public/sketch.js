let connectButton;

// Define the tabs
let tabs = [
  { label: 'RAW EEG DATA' }, // Width will be calculated dynamically
  { label: 'VISUALIZER' }   // Width will be calculated dynamically
];

let activeTab = 0; // The first tab is active by default (0 is 'RAW EEG DATA', 1 is 'VISUALIZER')
let showRawData = true; // Show raw EEG data by default

//heartbeat
let rawBPM = 60;
let smoothedBPM = 60;
let bpmInc = 0.1;


const EEGSketch = function(sketch) {
  sketch.setup = function() {
    const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvas.id('eeg_canvas');
    sketch.frameRate(20);
    setupMuse();
    setupMuseML();



  }

  sketch.draw = function () {
    sketch.background(0);


    // EEG chart
    if (showRawData){
      drawText(sketch);
      drawEegChart(sketch);
    }

  }

  sketch.windowResized = function () {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);

    // updateTabSizes();
    connectButton.y = 10; // Keep connect button at the top
  }
}

new p5(EEGSketch);

function smoothBPM() {
  if (rawBPM != 0 && rawBPM != smoothedBPM) {
    if (rawBPM < smoothedBPM - bpmInc) {
      smoothedBPM -= bpmInc;
    } else if (rawBPM > smoothedBPM + bpmInc) {
      smoothedBPM += bpmInc;
    } else {
      smoothedBPM = rawBPM;
    }
    updateMidiBpm(smoothedBPM);
  }
}







//DRAW SUBS
function drawText(sketch){
  sketch.noStroke();
  sketch.fill(255);
  sketch.textSize(10);
  //text("BATTERY: " + Math.floor(batteryLevel), width - 80, 10);

  sketch.textSize(12);
  sketch.textAlign(sketch.LEFT, sketch.TOP);
  let textX = 13;
  let textY = 13;
  sketch.text("NOISE: " + state.noise, textX, textY);
  sketch.text("MUSCLE: " + state.muscle, textX, textY+15);
  sketch.text("FOCUS: " + state.focus, textX, textY+30);
  sketch.text("CLEAR:  " + state.clear, textX, textY+45);
  sketch.text("MEDITATE: " + state.meditation.toFixed(4), textX, textY+60);
  sketch.text("DREAM: " + state.dream, textX, textY+75);


  //if bpm is valid
  // if (ppg.bpm) {
  //   //store bpm
  //   rawBPM = ppg.bpm;
  //   smoothBPM();

  //   if (ppg.heartbeat) {
  //     text("HEART bpm: " + smoothedBPM.toFixed(0) + " •", 10, 225);
  //   } else {
  //     text("HEART bpm: " + smoothedBPM.toFixed(0), 10, 225);
  //   }
  // }
}
function drawEegChart(sketch) {
  sketch.beginShape();
  sketch.strokeWeight(1);
  sketch.noFill();
  sketch.stroke(255);

  for (let i = 1; i <= eegSpectrum.length / 2; i++) {
    let x = sketch.map(i, 0, 48, 0, sketch.width);
    let y = sketch.map(eegSpectrum[i], 0, 50, sketch.height-50, 0);
    sketch.vertex(x, y); //<-- draw a line graph
  }
  sketch.endShape();
}


