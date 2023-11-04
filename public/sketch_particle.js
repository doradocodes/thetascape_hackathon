let particles = [];
let grow = true;
let isMediating = false;
let rotation = 0;

const particleSketch = function(sketch) {
    sketch.setup = function(){
        let canvas1 = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
        canvas1.position(0,0);
        canvas1.id('particle_canvas');
        sketch.angleMode(sketch.DEGREES);

        sketch.frameRate(45);

        let x = sketch.random(-100, 100);
        let y = sketch.random(-100, 100);
        let z = sketch.random(-100, 100);

        let pos = sketch.createVector(x, y, z);

        for(let i = 0; i < 100; i++) {
            let c = sketch.color(255, 255, 255);
            let p = new Particle(sketch, pos, c);
            particles.push(p);
        }
    }
    sketch.draw = function() {
        sketch.background(0, 0, 0);

        if(!showRawData) {
            if (!isMediating) {
                // rotate movement
                rotation++;
            }

            sketch.rotateX(rotation);
            sketch.rotateY(rotation);
            sketch.rotateZ(rotation);


            for(let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].show();
            }

            console.log(state);

            if (parseFloat(state.clear) > 0.5) {
                grow = false;
            } else {
                grow = true;
            }

            if (state.meditation > 0.5) {
                sketch.frameRate(30);
                grow = false;
            } else {
                sketch.frameRate(60);
            }
        }

    }
}
new p5(particleSketch);

class Particle {
    constructor(sketch, pos, color) {
        this.sketch = sketch;
        this.pos = this.sketch.createVector(pos.x, pos.y, pos.z);
        this.initPos = this.pos.copy();
        this.vel = p5.Vector.random3D().normalize().mult(this.sketch.random(4, 6));
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
        this.sketch.push();
        this.sketch.noStroke();
        this.sketch.fill(this.color);
        this.sketch.translate(this.pos.x, this.pos.y, this.pos.z);
        this.sketch.sphere(this.width);
        this.sketch.pop();
    }
}
