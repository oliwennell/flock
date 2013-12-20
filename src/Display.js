
var Flocking = Flocking || {};

Flocking.Display = {
    
    init: function(canvasElement) {

        var lastTimeUpdated = null;
        var simulation = new Flocking.Simulation();

        var render = function () {

        };

        var update = function () {

            requestAnimationFrame(update);

            var now = new Date().getTime();

            simulation.update(now - lastTimeUpdated);

            lastTimeUpdated = now;

            render();
        };

        lastTimeUpdated = new Date().getTime();
        update();
    }
}