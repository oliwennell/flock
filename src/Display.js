
var Flocking = Flocking || {};

Flocking.Display = {
    
    init: function(canvasElement) {

        var boids = [];
        for (var index = 0; index < 100; ++index) {
            var dir = new Flocking.Vector(Math.random(), Math.random());
            dir.normalise();
            var boid = new Flocking.Boid(
                new Flocking.Vector(canvasElement.width * 0.2 + canvasElement.width * Math.random() * 0.6, canvasElement.height * 0.2 + canvasElement.height * Math.random() * 0.6),
                new Flocking.Vector(dir.x, dir.y));
            boids.push(boid);
        }
        //boids = [
        //    new Flocking.Boid(new Flocking.Vector(416, 28), new Flocking.Vector(0.9, 0.5)),
        //    new Flocking.Boid(new Flocking.Vector(335, 259), new Flocking.Vector(0.5, 0.1)),
        //    new Flocking.Boid(new Flocking.Vector(588, 51), new Flocking.Vector(0.0, 0.8)),
        //    new Flocking.Boid(new Flocking.Vector(265, 201), new Flocking.Vector(0.7, 0.4)),
        //    new Flocking.Boid(new Flocking.Vector(589, 78), new Flocking.Vector(0.5, 0.4)),
        //    new Flocking.Boid(new Flocking.Vector(532, 43), new Flocking.Vector(0.3, 0.2)),
        //    new Flocking.Boid(new Flocking.Vector(298, 337), new Flocking.Vector(0.0, 0.1)),
        //    new Flocking.Boid(new Flocking.Vector(141, 377), new Flocking.Vector(0.7, 0.6)),
        //    new Flocking.Boid(new Flocking.Vector(188, 211), new Flocking.Vector(0.2, 0.1)),
        //    new Flocking.Boid(new Flocking.Vector(299, 41), new Flocking.Vector(0.5, 0.7))
        //];

        var boulders = [];
        for (var index = 0; index < Math.round(boids.length/10); ++index) {
            var pos = new Flocking.Vector(Math.random() * canvasElement.width, Math.random() * canvasElement.height);
            var boulder = { position: pos, radius: Math.random() * 5 };
            boulders.push(boulder);
        }

        var halfBoidSize = 1.5;
        var parameters = {
            flockRadius: 40,
            minDesirableDistance: 3,
            maxVelocity: 0.02,
            steeringSpeed: 0.002,
            width: canvasElement.width,
            height: canvasElement.height
        }
        var simulation = new Flocking.Simulation(boids, parameters, boulders);

        var lastTimeUpdated = null;

        var context = canvasElement.getContext('2d');
        
        var render = function () {
            context.clearRect(0, 0, canvasElement.width, canvasElement.height);

            var index;

            context.fillStyle = 'black';
            var boulders = simulation.getBoulders();
            for (index = 0; index < boulders.length; ++index) {
                var boulder = boulders[index];

                context.beginPath();
                context.arc(boulder.position.x, boulder.position.y, boulder.radius, 0, 2 * Math.PI, false);
                context.closePath();
                context.fill();
            }

            context.fillStyle = 'gray';
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