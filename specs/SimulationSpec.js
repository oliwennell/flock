describe("Simulation", function () {

    var boids = [];
    var simulation = null;
    var tolerance = 0.01;

    var parameters = {
        flockRadius: 40,
        minDesirableDistance: 5,
        maxVelocity: 0.01,
        steeringSpeed: 0.01,
        width: 600,
        height: 400
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
                expect(distance).toBeGreaterThan(5);
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

        describe("continues moving at its original velocity", function () {
            boids = [
                new Flocking.Boid(new Flocking.Vector(10, 10), new Flocking.Vector(1.000, 0.000)),
                new Flocking.Boid(new Flocking.Vector(10, 100), new Flocking.Vector(1.000, 0.000)),
            ];

            simulation = new Flocking.Simulation(boids, parameters);

            for (var time = 0; time < 2000; time += 15) {
                simulation.update(15);
            }

            expect(boids[0].position.x).toBeGreaterThan(10);
            expect(boids[0].position.y).toBeCloseTo(10, tolerance);
        });
    });

    describe("A boid that goes out of the visible area", function () {

        describe("via the top", function () {

            it("comes back in at the bottom", function () {
                boids = [
                    new Flocking.Boid(new Flocking.Vector(300, 5), new Flocking.Vector(0.000, -1.000)),
                ];

                simulation = new Flocking.Simulation(boids, parameters);

                for (var time = 0; time < 2000; time += 15) {
                    simulation.update(15);
                }

                expect(boids[0].position.x).toBe(300);
                expect(boids[0].position.y).toBeCloseTo(385, tolerance);
            });
        });

        describe("via the bottom", function () {

            it("comes back in at the top", function () {
                boids = [
                    new Flocking.Boid(new Flocking.Vector(300, 395), new Flocking.Vector(0.000, 1.000)),
                ];

                simulation = new Flocking.Simulation(boids, parameters);

                for (var time = 0; time < 2000; time += 15) {
                    simulation.update(15);
                }

                expect(boids[0].position.x).toBe(300);
                expect(boids[0].position.y).toBeCloseTo(15, tolerance);
            });
        });

        describe("via the left", function () {

            it("comes back in at the right", function () {
                boids = [
                    new Flocking.Boid(new Flocking.Vector(5, 200), new Flocking.Vector(-1.000, 0.000)),
                ];

                simulation = new Flocking.Simulation(boids, parameters);

                for (var time = 0; time < 2000; time += 15) {
                    simulation.update(15);
                }

                expect(boids[0].position.x).toBeCloseTo(585, tolerance);
                expect(boids[0].position.y).toBe(200);
            });
        });

        describe("via the right", function () {

            it("comes back in at the left", function () {
                boids = [
                    new Flocking.Boid(new Flocking.Vector(595, 200), new Flocking.Vector(1.000, 0.000)),
                ];

                simulation = new Flocking.Simulation(boids, parameters);

                for (var time = 0; time < 2000; time += 15) {
                    simulation.update(15);
                }

                expect(boids[0].position.x).toBeCloseTo(15, tolerance);
                expect(boids[0].position.y).toBe(200);
            });
        });
    });
});