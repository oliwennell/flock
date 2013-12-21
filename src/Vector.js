var Flocking = Flocking || {};

Flocking.Vector = function (x, y) {
    var self = this;
    self.x = x;
    self.y = y;

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
}