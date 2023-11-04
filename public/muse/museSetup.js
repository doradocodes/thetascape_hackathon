//is it a Muse 1 (usePPG = false) or Muse 2 (usePPG = true)
let usePPG = true;

function setupMuse() {
  //this handles the bluetooth connection between the Muse and the computer
  bluetoothConnection = new webBLE();
}



//when muse connects, this function fires
function museConnected(error, characteristics) {

  if (error) {
    console.log(error); //error connecting
  } else {
    // document.querySelector('#connect_button').style.display = 'none';
    isConnectButtonVisible = false;

    //prepare muse to stream data
    let museIsReady = initMuseStreaming(characteristics);

    //if muse is ready for streaming
    if (museIsReady) {
      startMuse();
    }

    //add disconnection script
    bluetoothConnection.onDisconnected(onDisconnected);
  }
}

//if muse disconnects
function museDisconnected() {
  console.log('Muse Disconnected');
}
