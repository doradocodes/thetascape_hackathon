let connectButton;
let isConnectButtonVisible = true;

// Define the tabs
let tabs = [
  { label: 'RAW EEG DATA' }, // Width will be calculated dynamically
  { label: 'VISUALIZER' }   // Width will be calculated dynamically
];

let activeTab = 0; // The first tab is active by default (0 is 'RAW EEG DATA', 1 is 'VISUALIZER')
let showRawData = true; // Show raw EEG data by default

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(20);
  setupMuse();
  setupMuseML();

  // Define the connectButton location and size
  connectButton = {
    x: width / 2 - 40,
    y: height - 100,
    w: 80,
    h: 30
  };

  // Calculate tab width based on the number of tabs and the canvas width
  updateTabSizes();
}

function draw() {

  background(0);
  

  if (isConnectButtonVisible) {
    drawButton();
  }

  // EEG chart
  if (showRawData){
    drawText();
    drawEegChart();
  } else {
    drawVisualizer();
  }
  
  // Draw tabs
  drawTabs();
}

//heartbeat
let rawBPM = 60;
let smoothedBPM = 60;
let bpmInc = 0.1;

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

function mousePressed() {
  // Check if the mouse is clicked within the connectButton's area
  if (mouseX > connectButton.x && mouseX < connectButton.x + connectButton.w && mouseY > connectButton.y && mouseY < connectButton.y + connectButton.h) {
    // The connectButton was clicked, you can call your connect function or whatever you need here
    connectToMuse();
    isConnectButtonVisible = false
  }

  // Check if one of the tabs is clicked
  for (let i = 0; i < tabs.length; i++) {
    let tab = tabs[i];
    if (mouseX > tab.x && mouseX < tab.x + tab.w && mouseY > tab.y && mouseY < tab.y + tab.h) {
      activeTab = i; // Set the clicked tab as active
      tabClicked(i); // Handle the tab click
      break;
    }
  }
}

function tabClicked(tabIndex) {
  console.log(`Tab ${tabs[tabIndex].label} clicked`);
  // You can add more functionality depending on what should happen when a tab is clicked
  if (tabIndex === 0) {
    showRawData = true;
  } else {
    showRawData = false;
  }
}


//RESIZE
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  updateTabSizes();
  connectButton.y = 10; // Keep connect button at the top
}

function updateTabSizes() {
  // Calculate the tab width dynamically based on canvas width
  let tabWidth = width / tabs.length;

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].x = i * tabWidth;      // Set x position
    tabs[i].w = tabWidth;          // Set width
    tabs[i].h = 40;                // Set height
    tabs[i].y = height - tabs[i].h; // Set y position
  }
}

//DRAW SUBS
function drawText(){
  noStroke();
  fill(255);
  textSize(10);
  //text("BATTERY: " + Math.floor(batteryLevel), width - 80, 10);

  textSize(12);
  textAlign(LEFT, TOP);
  let textX = 13;
  let textY = 13;
  text("NOISE: " + state.noise, textX, textY);
  text("MUSCLE: " + state.muscle, textX, textY+15);
  text("FOCUS: " + state.focus, textX, textY+30);
  text("CLEAR:  " + state.clear, textX, textY+45);
  text("MEDITATE: " + state.meditation.toFixed(4), textX, textY+60);
  text("DREAM: " + state.dream, textX, textY+75);


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
function drawVisualizer(){
  console.log("DORA")
}
function drawEegChart() {
  beginShape();
  strokeWeight(1);
  noFill();
  stroke(255);

  for (let i = 1; i <= eegSpectrum.length / 2; i++) {
    let x = map(i, 0, 48, 0, width);
    let y = map(eegSpectrum[i], 0, 50, height-50, 0);
    vertex(x, y); //<-- draw a line graph
  }
  endShape();
}
function drawButton() {
  // Draw the connectButton
  fill(0); // connectButton color black
  stroke(255); // Border color white
  strokeWeight(1); // Border thickness
  rect(connectButton.x, connectButton.y, connectButton.w, connectButton.h, 3); // 5 is for slight rounding of corners

  // connectButton text
  noStroke();
  fill(255); // Text color white
  textAlign(CENTER, CENTER);
  textSize(14);
  text('CONNECT', connectButton.x + connectButton.w / 2, connectButton.y + connectButton.h / 2);
}

function drawTabs() {
  for (let i = 0; i < tabs.length; i++) {
    let tab = tabs[i];
    fill(i === activeTab ? 40 : 0); // Active tab is lighter
    stroke(255);
    rect(tab.x, tab.y, tab.w, tab.h);
    fill(255);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2);
  }
}