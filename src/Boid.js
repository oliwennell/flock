Flocking = Flocking || {};

Flocking.Boid = function(position, heading) {
	var self = this;

	self.position = position || new Flocking.Vector();
	self.heading = heading || 0;

	self.calculateInfluencers = function (allOtherBoids, influenceRadius) {
	    var result = [];
	    var squaredInflucenRadius = influenceRadius * influenceRadius; // Compare squared distance to squared radius to avoid relatively expensive sqrt

	    for (var index = 0; index < allOtherBoids.length; ++index) {
	        var otherBoid = allOtherBoids[index];
	        var squaredDistance = self.position.getSquaredDistanceTo(otherBoid.position);
	        if (squaredDistance <= squaredInflucenRadius)
	            result.push(otherBoid);
	    }

	    return result;
	};
};