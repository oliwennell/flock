
var Flocking = Flocking || {};

Flocking.Display = {
    
    init: function(canvasElement) {

        var lastTimeUpdated = null;
        var simulation = new Flocking.Simulation();
        var context = canvasElement.getContext('2d');

        var render = function () {
            context.fillStyle = 'black';

            var halfBoidSize = 5;
            var boids = simulation.getBoids();
            for (var index = 0; index < boids.length; ++index) {
                var boid = boids[index];

                context.save();
                context.translate(boid.position.x, boid.position.y);
                context.rotate(boid.heading);

                context.beginPath();
                context.moveTo(-halfBoidSize, halfBoidSize);
                context.lineTo(-halfBoidSize, -halfBoidSize);
                context.lineTo(halfBoidSize*1.5, 0);
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