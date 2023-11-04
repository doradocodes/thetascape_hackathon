let isConnectButtonVisible = true;


const tabsSketch = function (sketch) {
    sketch.setup = function() {
        const canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
        canvas.id('tabs_canvas');
        // Calculate tab width based on the number of tabs and the canvas width
        updateTabSizes(sketch);

        // Define the connectButton location and size
        connectButton = {
            x: sketch.width / 2 - 40,
            y: sketch.height - 100,
            w: 80,
            h: 30
        };

    }

    sketch.draw = function() {
        if (isConnectButtonVisible) {
            drawButton(sketch);
        } else {
            sketch.clear();
        }

        // Draw tabs
        drawTabs(sketch);
    }

    sketch.mousePressed = function () {
        // Check if the mouse is clicked within the connectButton's area
        if (sketch.mouseX > connectButton.x && sketch.mouseX < connectButton.x + connectButton.w && sketch.mouseY > connectButton.y && sketch.mouseY < connectButton.y + connectButton.h) {
            // The connectButton was clicked, you can call your connect function or whatever you need here
            connectToMuse();
            isConnectButtonVisible = false
        }

        // Check if one of the tabs is clicked
        for (let i = 0; i < tabs.length; i++) {
            let tab = tabs[i];
            if (sketch.mouseX > tab.x && sketch.mouseX < tab.x + tab.w && sketch.mouseY > tab.y && sketch.mouseY < tab.y + tab.h) {
                activeTab = i; // Set the clicked tab as active
                tabClicked(i); // Handle the tab click
                break;
            }
        }
    }

    sketch.windowResized = function () {
        updateTabSizes(sketch);
    }

    // sketch.keyPressed = function () {
    //     if (sketch.keyCode === 32) {
    //         let fs = sketch.fullscreen();
    //         sketch.fullscreen(!fs);
    //     }
    // }
}

new p5(tabsSketch);

function tabClicked(tabIndex) {
    console.log(`Tab ${tabs[tabIndex].label} clicked`);
    // You can add more functionality depending on what should happen when a tab is clicked
    if (tabIndex === 0) {
        showRawData = true;
        document.querySelector('#particle_canvas').classList.remove('active');
        document.querySelector('#eeg_canvas').classList.add('active');
    } else {
        showRawData = false;
        document.querySelector('#particle_canvas').classList.add('active');
        document.querySelector('#eeg_canvas').classList.remove('active');
    }
}


function drawButton(sketch) {
    // Draw the connectButton
    sketch.fill(0); // connectButton color black
    sketch.stroke(255); // Border color white
    sketch.strokeWeight(1); // Border thickness
    sketch.rect(connectButton.x, connectButton.y, connectButton.w, connectButton.h, 3); // 5 is for slight rounding of corners

    // connectButton text
    sketch.noStroke();
    sketch.fill(255); // Text color white
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textSize(14);
    sketch.text('CONNECT', connectButton.x + connectButton.w / 2, connectButton.y + connectButton.h / 2);
}

function updateTabSizes(sketch) {
    // Calculate the tab width dynamically based on canvas width
    let tabWidth = sketch.width / tabs.length;

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].x = i * tabWidth;      // Set x position
        tabs[i].w = tabWidth;          // Set width
        tabs[i].h = 40;                // Set height
        tabs[i].y = sketch.height - tabs[i].h; // Set y position
    }
}

function drawTabs(sketch) {
    for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        sketch.fill(i === activeTab ? 40 : 0); // Active tab is lighter
        sketch.stroke(255);
        sketch.rect(tab.x, tab.y, tab.w, tab.h);
        sketch.fill(255);
        sketch.noStroke();
        sketch.textSize(14);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2);
    }
}
