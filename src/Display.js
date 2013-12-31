
var Flocking = Flocking || {};

Flocking.Display = {
    
    init: function(canvasElement) {

        var boids = [];
        for (var index = 0; index < 90; ++index) {
            var dir = new Flocking.Vector(Math.random(), Math.random());
            dir.normalise();
            var boid = new Flocking.Boid(
                new Flocking.Vector(canvasElement.width * 0.2 + canvasElement.width * Math.random() * 0.6, canvasElement.height * 0.2 + canvasElement.height * Math.random() * 0.6),
                new Flocking.Vector(dir.x, dir.y));
            boids.push(boid);
        }
        
        var boulders = [];
        for (var index = 0; index < 5; ++index) {
            var pos = new Flocking.Vector(Math.random() * canvasElement.width, Math.random() * canvasElement.height);
            var boulder = { position: pos, radius: 2 + Math.random() * 7 };
            boulders.push(boulder);
        }

        var halfBoidSize = 1.5;
        var parameters = {
            flockRadius: 20,
            minDesirableDistance: 3,
            maxVelocity: 0.0075,
            steeringSpeed: 0.01,
            width: canvasElement.width,
            height: canvasElement.height
        }
        var simulation = new Flocking.Simulation(boids, parameters, boulders);

        var lastTimeUpdated = null;

        var context = canvasElement.getContext('2d');
        
        var render = function () {
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);

            var index;

            context.fillStyle = 'red';
            var boulders = simulation.getBoulders();
            for (index = 0; index < boulders.length; ++index) {
                var boulder = boulders[index];

                context.beginPath();
                context.arc(boulder.position.x, boulder.position.y, boulder.radius, 0, 2 * Math.PI);
                context.closePath();
                context.fill();
            }

            context.fillStyle = 'black';
            var boids = simulation.getBoids();
            for (index = 0; index < boids.length; ++index) {
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