var Flocking = Flocking || {};

Flocking.Simulation = function (inputBoids, parameters) {
    var self = this;

    parameters = parameters || {};
    var flockRadius = parameters.flockRadius || 20;
    var minDesirableDistance = parameters.minDesirableDistance || 5;
    var maxVelocity = parameters.maxVelocity || 0.01;
    var steeringSpeed = parameters.steeringSpeed || 0.01;

    var boids = inputBoids.slice(0);

    self.getBoids = function () {
        return boids;
    };
    
    var getNeighbours = function (targetIndex) {
        var others = [];
        for (var index = 0; index < boids.length; ++index) {
            if (index != targetIndex)
                others.push(boids[index]);
        }

        return Flocking.BoidCollection.getWithinRadiusTo(others, boids[targetIndex].position, flockRadius);
    };

    var alignBoidWithNeighbours = function (boid, neighbours, msElapsed) {

        var avgHeading = Flocking.BoidCollection.getAverageVelocity(neighbours);
        avgHeading.limit(msElapsed * steeringSpeed);

        boid.velocity.add(avgHeading);
    };

    var steerBoidToCentreOfNeighbours = function (boid, neighbours, msElapsed) {

        var centre = Flocking.BoidCollection.getAveragePosition(neighbours);

        var sqDist = centre.getDistanceTo(boid.position);
        if (sqDist == 0)
            return new Flocking.Vector();

        var adjust = centre.duplicate();
        adjust.subtract(boid.position);
        adjust.normalise();
        adjust.multiplyScalar(msElapsed * maxVelocity);

        var steer = adjust.duplicate();
        steer.subtract(boid.velocity);

        steer.limit(msElapsed * steeringSpeed);
        boid.velocity.add(steer);
    };

    var separateBoidFromNeighbours = function (boid, neighbours, msElapsed) {

        var adjustedVel = new Flocking.Vector();
        var numAdjusted = 0;

        for (var index = 0; index < neighbours.length; ++index) {
            var neighbour = neighbours[index];
            
            var sqDist = neighbour.position.getSquaredDistanceTo(boid.position);
            var isTooClose = sqDist < minDesirableDistance * minDesirableDistance;
            if (!isTooClose)
                continue;

            var dir = neighbour.position.duplicate();
            dir.subtract(boid.position);
            
            var dist = dir.getLength();
            dir.multiplyScalar(1 / Math.min(dist, minDesirableDistance));

            dir.multiplyScalar(msElapsed * maxVelocity);

            dir.normalise();
            adjustedVel.add(dir);

            numAdjusted++;
        }

        if (numAdjusted == 0)
            return;

        adjustedVel.x /= numAdjusted;
        adjustedVel.y /= numAdjusted;
        
        adjustedVel.multiplyScalar(-1);

        boid.velocity.add(adjustedVel);
    };

    self.update = function (msElapsed) {
        
        for (var index = 0; index < boids.length; ++index) {
            var boid = boids[index];

            var neighbours = getNeighbours(index);
            if (neighbours.length != 0) {
                alignBoidWithNeighbours(boid, neighbours, msElapsed);
                separateBoidFromNeighbours(boid, neighbours, msElapsed);
                steerBoidToCentreOfNeighbours(boid, neighbours, msElapsed);
            }

            var diff = boid.velocity.duplicate();
            diff.limit(msElapsed * maxVelocity);
            boid.position.add(diff);
        }
    };
};