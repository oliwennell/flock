Flocking = Flocking || {};

Flocking.Application = function (canvasElementIn, numBoidsIn, numBouldersIn) {
    var self = this;

    var canvasElement = canvasElementIn;

    var simulation = null;

    var numBoids = numBoidsIn !== undefined ? numBoidsIn : 50;
    var boids = [];

    var numBoulders = numBouldersIn !== undefined ? numBouldersIn : 3;
    var boulders = [];

    var lastTimeUpdated = null;

    var createBoids = function () {
        boids = [];
        for (var index = 0; index < numBoids; ++index) {
            var dir = new Flocking.Vector(Math.random(), Math.random());
            dir.normalise();
            var boid = new Flocking.Boid(
                new Flocking.Vector(canvasElement.width * 0.1 + canvasElement.width * Math.random() * 0.8,
                                    canvasElement.height * 0.1 + canvasElement.height * Math.random() * 0.8),
                new Flocking.Vector(dir.x, dir.y));
            boids.push(boid);
        }
    };

    var createBoulders = function () {
        boulders = [];
        for (var index = 0; index < numBoulders; ++index) {
            var pos = new Flocking.Vector(Math.random() * canvasElement.width, Math.random() * canvasElement.height);
            var boulder = { position: pos, radius: 4 + Math.random() * 10 };
            boulders.push(boulder);
        }
    };

    var createSimulation = function () {
        var simulationParameters = {
            flockRadius: 30,
            minDesirableDistance: 7,
            maxVelocity: 0.035,
            steeringSpeed: 0.01,
            width: canvasElement.width,
            height: canvasElement.height
        }
        simulation = new Flocking.Simulation(boids, simulationParameters, boulders);
    };

    var update = function () {

        requestAnimationFrame(update);

        var now = new Date().getTime();

        simulation.update(now - lastTimeUpdated);

        lastTimeUpdated = now;

        render();
    };

    var render = function () {
        var context = canvasElement.getContext('2d');
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

        var halfBoidSize = 2.5;
        context.fillStyle = 'white';
        var boids = simulation.getBoids();
        for (index = 0; index < boids.length; ++index) {
            var boid = boids[index];

            context.save();
            context.translate(boid.position.x, boid.position.y);
            context.rotate(boid.velocity.getHeading());

            context.beginPath();
            context.moveTo(-halfBoidSize, halfBoidSize);
            context.lineTo(-halfBoidSize, -halfBoidSize);
            context.lineTo(halfBoidSize * 2, 0);
            context.closePath();
            context.fill();

            context.restore();
        }

        context.font = "10px Arial";
        context.fillText("Click to reset", 5, 10);
    };

    var initialise = function () {
        createBoids();
        createBoulders();
        createSimulation();

        lastTimeUpdated = new Date().getTime();
        update();
    };

    canvasElement.onclick = function () {
        initialise();
    };

    initialise();
};
