var Flocking = Flocking || {};

Flocking.Simulation = function () {
    var self = this;

    var boids = [];

    self.getBoids = function () {
        return boids;
    };

    var flockRadius = 40;
    var idealProximity = 20;

    var getNeighbours = function (targetIndex) {
        var others = [];
        for (var index = 0; index < boids.length; ++index) {
            if (index != targetIndex)
                others.push(boids[index]);
        }

        return Flocking.BoidCollection.getWithinRadiusTo(others, boids[targetIndex].position, flockRadius);
    };

    self.update = function (secondsElapsed) {
        
        for (var index = 0; index < boids.length; ++index) {
            var boid = boids[index];
            var neighbours = getNeighbours(index);

            var averageNeighbourDirection = Flocking.BoidCollection.getAverageVelocity(neighbours);
            averageNeighbourDirection.x /= neighbours.length;
            averageNeighbourDirection.y /= neighbours.length;
            averageNeighbourDirection.multiplyScalar(secondsElapsed * 0.001);

            boid.velocity.add(averageNeighbourDirection);
            if (boid.velocity.getLength() > 2) {
                boid.velocity.normalise();
                boid.velocity.multiplyScalar(2);
            }

            /*var overallPush = new Flocking.Vector();
            var numPushes = 0;

            for (var neighbourIndex = 0; neighbourIndex < neighbours.length; ++neighbourIndex) {
                var neighbour = neighbours[neighbourIndex];

                var dist = Math.sqrt(boid.position.getSquaredDistanceTo(neighbour.position));
                if (dist < idealProximity) {
                    // Too close
                    var push = neighbour.position.duplicate();
                    push.subtract(boid.position);
                    push.normalise();
                    push.multiplyScalar((-(1 / dist)) * secondsElapsed * 0.001);

                    overallPush.add(push);
                    numPushes++;
                }
                else if (dist > idealProximity) {
                    // Too far away
                    var push = neighbour.position.duplicate();
                    push.subtract(boid.position);
                    push.normalise();
                    push.multiplyScalar(dist * secondsElapsed * 0.00001);

                    overallPush.add(push);
                    numPushes++;
                }
                else {
                    continue;
                }
            }

            if (numPushes > 0) {
                overallPush.x = overallPush.x / numPushes;
                overallPush.y = overallPush.y / numPushes;
                boid.velocity.add(overallPush);
            }*/

            var diff = boid.velocity.duplicate();
            diff.multiplyScalar(secondsElapsed * 0.01);
            boid.position.add(diff);
        }
    };

    var init = function () {
        boids = [];
        boids.push(new Flocking.Boid(new Flocking.Vector(40, 30), new Flocking.Vector(0.500, 0.500)));
        boids.push(new Flocking.Boid(new Flocking.Vector(40, 40), new Flocking.Vector(1.000, 0.000)));
        boids.push(new Flocking.Boid(new Flocking.Vector(40, 50), new Flocking.Vector(0.500, -0.500)));
    };
    init();
};