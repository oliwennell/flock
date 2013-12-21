var Flocking = Flocking || {};

Flocking.Simulation = function () {
    var self = this;

    var boids = [];

    self.getBoids = function () {
        return boids;
    };

    var updateHeadings = function (secondsElapsed) {

    }

    self.update = function (secondsElapsed) {
        updateHeadings();
    };

    var init = function () {
        boids = [];
        boids.push(new Boid(new Flocking.Vector(20, 20), Math.PI*0.25));
        boids.push(new Boid(new Flocking.Vector(20, 40), 0));
        boids.push(new Boid(new Flocking.Vector(20, 60), Math.PI*1.75));
    };
    init();
};