describe("Simulation", function () {

    var boids = [];
    var simulation = null;
    var tolerance = 0.01;

    var parameters = {
        flockRadius: 40,
        minDesirableDistance: 5,
        maxDesirableDistance: 35,
        maxVelocity: 2
    };

    describe("A boid that is within range to others", function () {

        beforeEach(function () {
            boids = [
                new Flocking.Boid(new Flocking.Vector(40, 25), new Flocking.Vector(0.500, 0.500)),
                new Flocking.Boid(new Flocking.Vector(40, 40), new Flocking.Vector(1.000, 0.000)),
                new Flocking.Boid(new Flocking.Vector(40, 55), new Flocking.Vector(0.500, -0.500))
            ];

            simulation = new Flocking.Simulation(boids, parameters);
        });

        it("steers to match their average direction", function () {
            for (var time = 0; time < 2000; time += 15) {
                simulation.update(15);
            }

            for (var index = 0; index < 3; ++index) {
                var direction = boids[index].velocity.duplicate();
                direction.normalise();

                expect(direction.x).toBeCloseTo(1, tolerance);
                expect(direction.y).toBeCloseTo(0, tolerance);
            }
        });

        describe("when it starts to become too close", function () {

            it("moves away from them", function () {
                boids = [
                    new Flocking.Boid(new Flocking.Vector(40, 45), new Flocking.Vector(1.000, 0.000)),
                    new Flocking.Boid(new Flocking.Vector(40, 50), new Flocking.Vector(1.000, 0.000)),
                ];

                simulation = new Flocking.Simulation(boids, parameters);

                for (var time = 0; time < 2000; time += 15) {
                    simulation.update(15);
                }

                var distance = boids[0].position.getDistanceTo(boids[1].position);
                expect(distance).toBeGreaterThan(4.9);
            });
        });

        describe("when it starts to become too far away", function () {

            it("moves away from them", function () {
                boids = [
                    new Flocking.Boid(new Flocking.Vector(40, 40), new Flocking.Vector(1.000, 0.000)),
                    new Flocking.Boid(new Flocking.Vector(40, 75), new Flocking.Vector(1.000, 0.000)),
                ];

                simulation = new Flocking.Simulation(boids, parameters);

                for (var time = 0; time < 2000; time += 15) {
                    simulation.update(15);
                }

                var distance = boids[0].position.getDistanceTo(boids[1].position);
                expect(distance).toBeLessThan(35);
            });
        });
    });

    describe("A boid that isn't within range to others", function () {

        it("does not change its steering", function () {
            boids = [
                new Flocking.Boid(new Flocking.Vector(40, 0), new Flocking.Vector(0.500, 0.500)),
                new Flocking.Boid(new Flocking.Vector(40, 50), new Flocking.Vector(1.000, 0.000)),
                new Flocking.Boid(new Flocking.Vector(40, 100), new Flocking.Vector(0.500, -0.500))
            ];

            simulation = new Flocking.Simulation(boids, parameters);

            for (var time = 0; time < 2000; time += 15) {
                simulation.update(15);
            }

            var direction = boids[0].velocity.duplicate();
            direction.normalise();
            expect(direction.x).toBeCloseTo(0.5, tolerance);
            expect(direction.y).toBeCloseTo(0.5, tolerance);

            direction = boids[1].velocity.duplicate();
            direction.normalise();
            expect(direction.x).toBeCloseTo(1.0, tolerance);
            expect(direction.y).toBeCloseTo(0.0, tolerance);

            direction = boids[2].velocity.duplicate();
            direction.normalise();
            expect(direction.x).toBeCloseTo(0.5, tolerance);
            expect(direction.y).toBeCloseTo(-0.5, tolerance);
        });

        it("does not move towards or away from them", function () {
            boids = [
                new Flocking.Boid(new Flocking.Vector(40, 10), new Flocking.Vector(1.000, 0.000)),
                new Flocking.Boid(new Flocking.Vector(40, 80), new Flocking.Vector(1.000, 0.000)),
            ];

            simulation = new Flocking.Simulation(boids, parameters);

            for (var time = 0; time < 2000; time += 15) {
                simulation.update(15);
            }

            var distance = boids[0].position.getDistanceTo(boids[1].position);
            expect(distance).toBeCloseTo(70, tolerance);
        });
    });
});