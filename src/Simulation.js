var Flocking = Flocking || {};

Flocking.Simulation = function (inputBoids, parameters) {
    var self = this;

    parameters = parameters || {};
    var flockRadius = parameters.flockRadius || 40;
    var minDesirableDistance = parameters.minDesirableDistance || 5;
    var maxDesirableDistance = parameters.maxDesirableDistance || 35;
    var maxVelocity = parameters.maxVelocity || 2;
    var steeringSpeed = parameters.steeringSpeed || 0.001;
    var moveSpeed = parameters.moveSpeed = 0.01;

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

    var steerBoidToMatchNeighbours = function (boid, neighbours, msElapsed) {

        var avgHeading = Flocking.BoidCollection.getAverageVelocity(neighbours);
        avgHeading.x /= neighbours.length;
        avgHeading.y /= neighbours.length;
        avgHeading.multiplyScalar(msElapsed * steeringSpeed);

        boid.velocity.add(avgHeading);
    };

    var maintainBoidDistance = function (boid, neighbours, msElapsed) {

        var adjustedVel = new Flocking.Vector();
        var numAdjusted = 0;

        for (var index = 0; index < neighbours.length; ++index) {
            var neighbour = neighbours[index];
            
            var sqDist = neighbour.position.getSquaredDistanceTo(boid.position);

            var isTooClose = sqDist < minDesirableDistance * minDesirableDistance;
            var isTooFarAway = sqDist > maxDesirableDistance * maxDesirableDistance;
            if (!isTooClose && !isTooFarAway)
                continue;

            var dir = neighbour.position.duplicate();
            dir.subtract(boid.position);
            
            var dist = dir.getLength();
            if (isTooClose)
                dir.multiplyScalar(1 / Math.min(dist, minDesirableDistance));
            else
                dir.multiplyScalar(-1 * Math.min(dist, flockRadius));

            dir.multiplyScalar(msElapsed * moveSpeed);

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
            var neighbours = getNeighbours(index);
            if (neighbours.length == 0)
                continue;

            var boid = boids[index];
            steerBoidToMatchNeighbours(boid, neighbours, msElapsed);
            maintainBoidDistance(boid, neighbours, msElapsed);
            
            if (boid.velocity.getLength() > maxVelocity) {
                boid.velocity.normalise();
                boid.velocity.multiplyScalar(maxVelocity);
            }

            var diff = boid.velocity.duplicate();
            diff.multiplyScalar(msElapsed * moveSpeed);
            boid.position.add(diff);
        }
    };
};