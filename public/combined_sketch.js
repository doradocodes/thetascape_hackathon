let graphCanvas;
let visualizerCanvas;
let tabCanvas;

let connectButton;
let isConnectButtonVisible = true;

let particles = [];
let grow = true;
let isMediating = false;
let rotation = 0;

// Define the tabs
let tabs = [
    { label: 'RAW EEG DATA' }, // Width will be calculated dynamically
    { label: 'VISUALIZER' }   // Width will be calculated dynamically
];

let activeTab = 0; // The first tab is active by default (0 is 'RAW EEG DATA', 1 is 'VISUALIZER')
let showRawData = true; // Show raw EEG data by default

function setup() {
    tabCanvas = createGraphics(windowWidth, 40);
    graphCanvas = createGraphics(windowWidth, windowHeight);
    visualizerCanvas = createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);

    setupMuse();
    setupMuseML();

    // Define the connectButton location and size
    connectButton = {
        x: width / 2 - 40,
        y: height - 100,
        w: 80,
        h: 30
    };

    // setup particles
    let x = random(-100, 100);
    let y = random(-100, 100);
    let z = random(-100, 100);

    let pos = createVector(x, y, z);

    for(let i = 0; i < 100; i++) {
        let c = color(255, 255, 255);
        let p = new Particle(pos, c);
        particles.push(p);
    }
}

function draw() {
    background(0);
    drawVisualizer();

    // EEG chart
    graphCanvas.background(0);
    if (isConnectButtonVisible) {
        drawButton();
    }
    image(graphCanvas, -(windowWidth / 2), -(windowHeight / 2));

    // Draw tabs
    drawTabs();
    image(tabCanvas, -(windowWidth / 2), (windowHeight / 2) - 40);
}

function drawVisualizer(){
    console.log("DORA")
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

function drawButton() {
    // Draw the connectButton
    graphCanvas.fill(0); // connectButton color black
    graphCanvas.stroke(255); // Border color white
    graphCanvas.strokeWeight(1); // Border thickness
    graphCanvas.rect(connectButton.x, connectButton.y, connectButton.w, connectButton.h, 3); // 5 is for slight rounding of corners

    // connectButton text
    graphCanvas.noStroke();
    graphCanvas.fill(255); // Text color white
    graphCanvas.textAlign(CENTER, CENTER);
    graphCanvas.textSize(14);
    graphCanvas.text('CONNECT', connectButton.x + connectButton.w / 2, connectButton.y + connectButton.h / 2);
}

function drawTabs() {
    let tabWidth = tabCanvas.width / tabs.length;
    for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        tabCanvas.fill(i === activeTab ? 40 : 0); // Active tab is lighter
        tabCanvas.stroke(255);
        tabCanvas.rect((i * tabWidth), 0, tabWidth, 40);
        tabCanvas.fill(255);
        tabCanvas.noStroke();
        tabCanvas.textSize(14);
        tabCanvas.textAlign(CENTER, CENTER);
        tabCanvas.text(tab.label, (i * tabWidth) + tabWidth / 2, 20);
    }
}

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
