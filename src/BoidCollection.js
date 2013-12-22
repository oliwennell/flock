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
	
	getWithinRadiusTo: function (boids, position, radius) {
	    var result = [];
	    var squaredRadius = radius * radius; // Compare squared distance to squared radius to avoid relatively expensive sqrt

	    for (var index = 0; index < boids.length; ++index) {
	    	var boid = boids[index];
	        var squaredDistance = position.getSquaredDistanceTo(boid.position);
	        if (squaredDistance <= squaredRadius)
	        	result.push(boid);
	    }

	    return result;
	}
}