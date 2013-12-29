describe("BoidCollection", function() {
	
	describe("average velocity", function () {

		it("is [0,0] when no boids specified", function() {
		    var averageVelocity = Flocking.BoidCollection.getAverageVelocity([]);

		    expect(averageVelocity.x).toBe(0);
		    expect(averageVelocity.y).toBe(0);
		});


		it("is calculated from the given boids' normalised velocity", function () {

			var boids =[
				new Flocking.Boid(null, new Flocking.Vector(0, 10)),
				new Flocking.Boid(null, new Flocking.Vector(100, 0)),
			];

			var averageDirection = Flocking.BoidCollection.getAverageVelocity(boids);

			expect(averageDirection.x).toBe(50);
			expect(averageDirection.y).toBe(5);
		});
	});

	describe("average position", function() {
	
		it("is [0,0] when no boids specified", function() {
			var averagePosition = Flocking.BoidCollection.getAveragePosition([]);

			expect(averagePosition.x).toBe(0);
			expect(averagePosition.y).toBe(0);
		});

		it("is calculated from the given boids' positions", function() {

			var boids =[
				new Flocking.Boid(new Flocking.Vector(-2, -2)),
				new Flocking.Boid(new Flocking.Vector(2, 2)),
				new Flocking.Boid(new Flocking.Vector(3, 3)),
				];

			var averagePosition = Flocking.BoidCollection.getAveragePosition(boids);

			expect(averagePosition.x).toBe(1);
			expect(averagePosition.y).toBe(1);
		});
	});
	
	describe("boids within radius", function () {

		describe("when all boids are within a given distance", function () {
        
			it("all of them are returned", function () {
				var boids = [
					new Flocking.Boid(new Flocking.Vector(-1,0)),
					new Flocking.Boid(new Flocking.Vector(1, 0)),
					new Flocking.Boid(new Flocking.Vector(2, 0)),
				];

				var within = Flocking.BoidCollection.getWithinRadiusTo(new Flocking.Boid(new Flocking.Vector(0, 0)), boids, 2);

				expect(within.length).toBe(3);
				expect(within[0]).toBe(boids[0]);
				expect(within[1]).toBe(boids[1]);
				expect(within[2]).toBe(boids[2]);
			});
		});

		describe("when some boids are within a given distance", function () {

			it("the ones within are returned", function () {
				var boids = [
					new Flocking.Boid(new Flocking.Vector(-10, 0)),
					new Flocking.Boid(new Flocking.Vector(10, 0)),
					new Flocking.Boid(new Flocking.Vector(2.01, 0)),

					new Flocking.Boid(new Flocking.Vector(-1, 0)),
					new Flocking.Boid(new Flocking.Vector(1, 0))
				];

				var within = Flocking.BoidCollection.getWithinRadiusTo(new Flocking.Boid(new Flocking.Vector(0, 0)), boids, 2);

				expect(within.length).toBe(2);
				expect(within[0]).toBe(boids[3]);
				expect(within[1]).toBe(boids[4]);
			});
		});

		describe("when no boids are within a given distance", function () {

			it("none are returned", function () {
				var boids = [
					new Flocking.Boid(new Flocking.Vector(-10, 0)),
					new Flocking.Boid(new Flocking.Vector(10, 0)),
				];

				var within = Flocking.BoidCollection.getWithinRadiusTo(new Flocking.Boid(new Flocking.Vector(0, 0)), boids, 2);

				expect(within.length).toBe(0);
			});
		});
	});
});