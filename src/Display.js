
var Flocking = Flocking || {};

Flocking.Display = {
    
    init: function(canvasElement) {

        var boids = [];
        var width = canvasElement.width;
        var height = canvasElement.height;
        for (var index = 0; index < 150; ++index) {
            var dir = new Flocking.Vector(Math.random(), Math.random());
            dir.normalise();
            var boid = new Flocking.Boid(
                new Flocking.Vector(width*0.2 + width * Math.random()*0.6, height*0.2 + height * Math.random()*0.6),
                new Flocking.Vector(dir.x, dir.y));
            boids.push(boid);
        }
        var halfBoidSize = 1.5;
        var parameters = {
            flockRadius: 40,
            minDesirableDistance: 3,
            maxVelocity: 0.005,
            steeringSpeed: 0.002
        }
        var simulation = new Flocking.Simulation(boids, parameters);

        var lastTimeUpdated = null;

        var context = canvasElement.getContext('2d');
        
        var render = function () {
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);

            context.fillStyle = 'black';

            var boids = simulation.getBoids();
            for (var index = 0; index < boids.length; ++index) {
                var boid = boids[index];

                context.save();
                context.translate(boid.position.x, boid.position.y);
                context.rotate(boid.velocity.getHeading());

                context.beginPath();
                context.moveTo(-halfBoidSize, halfBoidSize);
                context.lineTo(-halfBoidSize, -halfBoidSize);
                context.lineTo(halfBoidSize*2, 0);
                context.closePath();
                context.fill();

                context.restore();
            }
        };

        var update = function () {

            requestAnimationFrame(update);

            var now = new Date().getTime();

            simulation.update(now - lastTimeUpdated);

            lastTimeUpdated = now;

            render();
        };

        lastTimeUpdated = new Date().getTime();
        update();
    }
}