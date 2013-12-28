var Flocking = Flocking || {};

Flocking.Vector = function (x, y) {
    var self = this;
    self.x = x || 0;
    self.y = y || 0;

    self.add = function (other) {
        self.x += other.x;
        self.y += other.y;
    };

    self.subtract = function (other) {
        self.x -= other.x;
        self.y -= other.y;
    };

    self.multiplyScalar = function (scalar) {
        self.x *= scalar;
        self.y *= scalar;
    };

    self.normalise = function () {
        var length = Math.sqrt(self.x * self.x + self.y * self.y);
        if (length == 0)
            return;

        self.x /= length;
        self.y /= length;
    };

    self.duplicate = function () {
        return new Flocking.Vector(self.x, self.y);
    };

    self.getLength = function () {
        return Math.sqrt(self.x*self.x + self.y*self.y);
    };

    self.getHeading = function () {

        var result = Math.atan2(self.y, self.x);
        if (result < 0)
            result = Math.PI + (Math.PI - (result * -1));

        return result;
    };

    self.getSquaredDistanceTo = function(otherVector) {
        var dx = Math.abs(self.x - otherVector.x);
        var dy = Math.abs(self.y - otherVector.y);
        return dx * dx + dy * dy;
    };

    self.getDistanceTo = function (otherVector) {
        return Math.sqrt(self.getSquaredDistanceTo(otherVector));
    };

    self.limit = function (maxVelocity) {
        if (self.getLength() > maxVelocity) {
            self.normalise();
            self.multiplyScalar(maxVelocity);
        }
    };
}