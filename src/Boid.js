Flocking = Flocking || {};

Flocking.Boid = function (position, velocity) {
	var self = this;

	self.position = position || new Flocking.Vector();
	self.velocity = velocity || new Flocking.Vector();

	self.getDirection = function () {
	    var direction = self.velocity.duplicate();
	    direction.normalise();
	    return direction;
	};
};