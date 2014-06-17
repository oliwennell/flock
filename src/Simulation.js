var Flocking = Flocking || {};

Flocking.Simulation = function (inputBoids, parameters, inputBoulders) {
    var self = this;

    parameters = parameters || {};
    var flockRadius = parameters.flockRadius || 20;
    var minDesirableDistance = parameters.minDesirableDistance || 5;
    var maxVelocity = parameters.maxVelocity || 0.01;
    var steeringSpeed = parameters.steeringSpeed || 0.01;
    var width = parameters.width || 600;
    var height = parameters.height || 400;

    var boids = inputBoids.slice(0);
    var boulders = inputBoulders !== undefined ? inputBoulders.slice(0) : [];

    self.getBoids = function () {
        return boids;
    };

    self.getBoulders = function () {
        return boulders;
    };
    
    var alignBoidWithNeighbours = function (boid, neighbours, msElapsed) {

        var avgHeading = Flocking.BoidCollection.getAverageVelocity(neighbours);
        avgHeading.clamp(msElapsed * steeringSpeed);

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

        steer.clamp(msElapsed * steeringSpeed);
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

            adjustedVel.add(dir);

            numAdjusted++;
        }

        if (numAdjusted == 0)
            return;

        adjustedVel.divideScalar(numAdjusted);
        adjustedVel.normalise();
        adjustedVel.multiplyScalar(-1 * msElapsed * maxVelocity);

        boid.velocity.add(adjustedVel);
    };

    var separateBoidFromBoulders = function (boid, msElapsed) {
        var adjustedVel = new Flocking.Vector();
        var numAdjusted = 0;
        var boulderRadiusScale = 2.5;

        for (var index = 0; index < boulders.length; ++index) {
            var boulder = boulders[index];

            var sqDist = boulder.position.getSquaredDistanceTo(boid.position);
            var isTooClose = sqDist < Math.pow(boulder.radius * boulderRadiusScale, 2);
            if (!isTooClose)
                continue;

            var dir = boulder.position.duplicate();
            dir.subtract(boid.position);

            // New heading is at a right angle to the vector between boid and boulder
            var x = dir.x;
            var y = dir.y;
            dir.x = y;
            dir.y = -x;

            var dist = dir.getLength();
            var maxDist = boulder.radius * boulderRadiusScale;
            dir.normalise();

            // The closer the boulder is, the larger the force we want to apply away from it.
            dir.multiplyScalar(Math.pow(maxDist / dist, 2) * maxVelocity);

            adjustedVel.add(dir);

            numAdjusted++;
        }

        if (numAdjusted == 0)
            return;

        adjustedVel.divideScalar(numAdjusted);
        adjustedVel.multiplyScalar(msElapsed * 100);

        boid.velocity.add(adjustedVel);
    };

    var preventBoidsPenetratingBoulders = function (boid) {

        for (var index = 0; index < boulders.length; ++index) {
            var boulder = boulders[index];

            var dist = boulder.position.getDistanceTo(boid.position);
            var isInside = dist <= boulder.radius;
            if (!isInside)
                continue;

            var dir = boid.position.duplicate();
            dir.subtract(boulder.position);
            dir.normalise();
            dir.multiplyScalar(boulder.radius - dist + 0.1);

            boid.position.add(dir);
        }
    };
        
    self.update = function (msElapsed) {
        
        for (var index = 0; index < boids.length; ++index) {
            var boid = boids[index];

            var neighbours = Flocking.BoidCollection.getWithinRadiusTo(boids[index], boids, flockRadius);
            if (neighbours.length != 0) {
                alignBoidWithNeighbours(boid, neighbours, msElapsed);
                separateBoidFromNeighbours(boid, neighbours, msElapsed);
                steerBoidToCentreOfNeighbours(boid, neighbours, msElapsed);
            }

            if (boulders.length != 0) {
                separateBoidFromBoulders(boid, msElapsed);
                preventBoidsPenetratingBoulders(boid);
            }

            var diff = boid.velocity.duplicate();
            diff.clamp(msElapsed * maxVelocity);
            boid.position.add(diff);

            if (boid.position.y < 0) boid.position.y = height + boid.position.y;
            else if (boid.position.y > height) boid.position.y = boid.position.y - height;
            if (boid.position.x < 0) boid.position.x = width + boid.position.x;
            else if (boid.position.x > width) boid.position.x = boid.position.x - width;

            for (var j = 0; j < boid.trail.length; ++j) {
                var trailItem = boid.trail[j];
                if (trailItem.alpha == 0)
                    continue;
                trailItem.alpha -= msElapsed * 0.0005;
                if (trailItem.alpha < 0)
                    trailItem.alpha = 0;
            }
            boid.trailTick += msElapsed;
            if (boid.trailTick > 120) {
                boid.trailTick = 0;
                boid.trail.push({ position: boid.position.duplicate(), velocity: boid.velocity.duplicate(), alpha: 1 });
                if (boid.trail.length > 20)
                    boid.trail.splice(0, 1);
            }
        }
    };
};