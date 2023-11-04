let particles = [];
let grow = true;
let isMediating = false;
let rotation = 0;
let isConnectButtonVisible = true;


function setup() {
    const particleCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
    particleCanvas.id('particle_canvas');
    angleMode(DEGREES);

    frameRate(45);

    let x = random(-100, 100);
    let y = random(-100, 100);
    let z = random(-100, 100);

    let pos = createVector(x, y, z);

    for(let i = 0; i < 100; i++) {
        let c = color(255, 255, 255);
        let p = new Particle(pos, c);
        particles.push(p);
    }
    setupMuse();
    setupMuseML();

    drawButton();
}



function draw() {
    // console.log(frameCount)
    background(0, 0, 0);


    if (!isMediating) {
        // rotate movement
        rotation++;
    }

    rotateX(rotation);
    rotateY(rotation);
    rotateZ(rotation);

    // directionalLight([255], createVector(0,0,-1))


    for(let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
    }
}

// function mousePressed() {
//     console.log('flip direction')
//     grow = !grow;
// }
//
// function keyPressed(){
//     if (keyCode === ENTER){
//         frameRate(30);
//         console.log('isMediating', isMediating)
//     }
// }


class Particle {
    constructor(pos, color) {
        this.pos = createVector(pos.x, pos.y, pos.z);
        this.initPos = this.pos.copy();
        this.vel = p5.Vector.random3D().normalize().mult(random(4, 6));
        this.color = color;
        this.width = 1;
        this.pos.add(this.vel);
    }

    getDistance() {
        return this.pos.dist(this.initPos);
    }

    update() {
        if (grow) {
            this.pos = p5.Vector.add(this.pos, this.vel);
        } else {
            if (this.getDistance() >= 50) {
                this.pos = p5.Vector.sub(this.pos, this.vel);
            }

        }
    }

    show() {
        push();
        noStroke();
        fill(this.color);
        translate(this.pos.x, this.pos.y, this.pos.z);
        sphere(this.width);
        pop();
    }
}


function drawButton() {
    const connectButton = document.querySelector('#connect_button');
    connectButton.addEventListener('click', connectToMuse);

}

// function drawButton() {
//     // Draw the connectButton
//     fill(0); // connectButton color black
//     stroke(255); // Border color white
//     strokeWeight(1); // Border thickness
//     rect(connectButton.x, connectButton.y, connectButton.w, connectButton.h, 3); // 5 is for slight rounding of corners
//
//     // connectButton text
//     noStroke();
//     fill(255); // Text color white
//     textAlign(CENTER, CENTER);
//     textSize(14);
//     text('CONNECT', connectButton.x + connectButton.w / 2, connectButton.y + connectButton.h / 2);
// }

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
