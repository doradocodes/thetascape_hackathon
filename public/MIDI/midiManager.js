let midiOuts;
//noise, muscle, focus, clear, meditation, dream

let stateCcOn = [true, true, true, true, true, true];

let stateMidiCcNumber = 20;
let stateMidiChannels = [1, 2, 3, 4, 5, 6];
let stateMidiValues = [-1, -1, -1, -1, -1, -1];
let stateSmoothingValues = [
  [5, 5], //noise
  [4, 4], //muscle
  [3, 2], //focus
  [2, 2], //clear
  [1, 1], //meditation
  [1, 1]  //dream
];

//Init WebMIDI
WebMidi.enable(function (err) {
  if (err) {
    console.error("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled, outputs:", WebMidi.outputs);

    // Get the output port (your MIDI device)
    midiOuts = WebMidi.outputs;

    console.log("MIDI out", midiOuts);

    // Check if an output is available
    if (!midiOuts) {
      console.error("No MIDI output available.");
      return;
    }

    //set all to zero
    // for (let i= 0; i < stateMidiChannels.length; i++){
    //   sendStateCC(i, 0);
    // }

  }
});

function convertMlResultsToMidiCC() {

  sendStateCC(0, state.noise);
  sendStateCC(1, state.muscle);
  sendStateCC(2, state.focus);
  sendStateCC(3, state.clear);
  sendStateCC(4, state.meditation);
  sendStateCC(5, state.dream);
}

function sendStateCC(stateID, stateValue) {
  //is channel open?
  let channelOpen = stateCcOn[stateID];

  //if open...
  if (channelOpen) {
    //create midi value by mapping down the state mVolts
    let newMidiValue = mapRange(stateValue, 0.0, 1.0, 0, 127);
    newMidiValue = Math.min(127, Math.max(0, newMidiValue));
    newMidiValue = Math.round(newMidiValue);

    //don't send same value repeatedly
    if (newMidiValue != stateMidiValues[stateID]) {

      //get smoothing values
      let smoothingValues = stateSmoothingValues[stateID];
      let upInc = smoothingValues[0];
      let dnInc = smoothingValues[1];

      //smoothing
      if (newMidiValue > stateMidiValues[stateID] + upInc){
        stateMidiValues[stateID] += upInc;
      } else if (newMidiValue < stateMidiValues[stateID] - dnInc) {
        stateMidiValues[stateID] -= dnInc;
      } else {
        stateMidiValues[stateID] = newMidiValue;
      }

      //get state channel
      let stateMidiChannel = stateMidiChannels[stateID];

      //send to all midi outs
      for (let i = 0; i < midiOuts.length; i++) {
        let midiOut = midiOuts[i];

        midiOut.sendControlChange(
          stateMidiCcNumber,
          stateMidiValues[stateID],
          stateMidiChannel
        );
      }
    }
  }
}

//TOGGLE STREAMS
//managers if the state data stream is being sent out
//default is off, because ableton will map to all streaming cc'd when doing MIDI mapping

function updateStateCcOn(stateID, newState) {
  console.log("State", stateID, "is now", newState);
  stateCcOn[stateID] = newState;
}

//Test MIDI button
function testMidiButtonClicked(buttonIndex) {
  //send random value between 0 and 1 to midi CC function
  //this will make sure that it's a different value each time
  console.log("State", buttonIndex, "is send a test message for MIDI mapping");

  //send to all midi outs
  for (let i = 0; i < midiOuts.length; i++) {
    let midiOut = midiOuts[i];

    midiOut.sendControlChange(
      stateMidiCcNumber,
      random(127),
      stateMidiChannels[buttonIndex]
    );
  }
}


//BPM
let HEARTBEAT_MIDI_CHANNEL = 10;
let midiBpmActive = false;
function activateMidiBpm(active) {
  midiBpmActive = active;
}

function updateMidiBpm(bpm) {
  if (bpm != undefined) {
    bpmInterval = 60000 / bpm;
    //console.log("BPM is now", bpm, "ms interval is now", bpmInterval);
  }
}

let bpmInterval = 1000; //starts at 60 bpm

function bpmRenderLoop() {

  // Your repeating logic/code here
  //console.log('Running at dynamic interval at ', bpmInterval);
  //console.log('midiBpmActive', midiBpmActive)
  // sketch.js file turns loop on if device is connected and off if device is not
  if (midiBpmActive) {

    //send midi note C3 out on channel 10
    for (let i = 0; i < midiOuts.length; i++) {
      let midiOut = midiOuts[i];
      midiOut.playNote("C3", HEARTBEAT_MIDI_CHANNEL);


    }
  }

  // Schedule the next call based on the current interval
  setTimeout(bpmRenderLoop, bpmInterval);
}

// Kick off the first call
setTimeout(bpmRenderLoop, bpmInterval);
