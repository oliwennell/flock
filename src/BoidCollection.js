Flocking = Flocking || {};

Flocking.BoidCollection = {

    getAverageVelocity: function (boids) {
		if (boids.length == 0)
			return new Flocking.Vector();

		var sum = new Flocking.Vector();
		for (var index = 0; index < boids.length; ++index) {
		    sum.add(boids[index].velocity);
		}

		return new Flocking.Vector(sum.x / boids.length, sum.y / boids.length);
	},

	getAveragePosition: function (boids) {
		if (boids.length == 0)
			return new Flocking.Vector();

		var sum = new Flocking.Vector();
		for (var index = 0; index < boids.length; ++index)
			sum.add(boids[index].position);

		return new Flocking.Vector(sum.x / boids.length, sum.y / boids.length);
	},
	
	getWithinRadiusTo: function (boid, boids, radius) {
	    var result = [];
	    var squaredRadius = radius * radius; // Compare squared distance to squared radius to avoid relatively expensive sqrt

	    for (var index = 0; index < boids.length; ++index) {
	        var otherBoid = boids[index];
	        if (otherBoid === boid)
	            continue;

	        var squaredDistance = boid.position.getSquaredDistanceTo(otherBoid.position);
	        if (squaredDistance <= squaredRadius)
	        	result.push(otherBoid);
	    }

	    return result;
	}
}