
var Flocking = Flocking || {};

Flocking.Display = {
    
    init: function(canvasElement) {

        var boids = [];
        for (var index = 0; index < 30; ++index) {
            var dir = new Flocking.Vector(Math.random(), Math.random());
            dir.normalise();
            var boid = new Flocking.Boid(new Flocking.Vector(150+Math.random(), 100+Math.random()), new Flocking.Vector(dir.x, dir.y));
            boids.push(boid);
        }
        var parameters = {
            maxVelocity: 1,
            minDesirableDistance: 7,
            maxDesirableDistance: 40,
            flockRadius: 50
        }
        var simulation = new Flocking.Simulation(boids, parameters);

        var lastTimeUpdated = null;

        var context = canvasElement.getContext('2d');
        
        var render = function () {
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);

            context.fillStyle = 'black';

            var halfBoidSize = 2;
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