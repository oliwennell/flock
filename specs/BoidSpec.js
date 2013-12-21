
describe("Boid", function () {

    var boid = null;

    beforeEach(function () {
        boid = new Flocking.Boid(new Flocking.Vector(0,0));
    });

    describe("when all other boids are within a boid's sphere of influence", function () {
        
        it("all of them are influencers", function () {
            var otherBoids = [
                new Flocking.Boid(new Flocking.Vector(-1,0)),
                new Flocking.Boid(new Flocking.Vector(1, 0)),
                new Flocking.Boid(new Flocking.Vector(2, 0)),
            ];

            var influencers = boid.calculateInfluencers(otherBoids, 2);

            expect(influencers.length).toBe(3);
            expect(influencers[0]).toBe(otherBoids[0]);
            expect(influencers[1]).toBe(otherBoids[1]);
            expect(influencers[2]).toBe(otherBoids[2]);
        });
    });

    describe("when some other boids are within a boid's sphere of influence", function () {

        it("the ones within are influencers", function () {
            var otherBoids = [
                new Flocking.Boid(new Flocking.Vector(-10, 0)),
                new Flocking.Boid(new Flocking.Vector(10, 0)),
                new Flocking.Boid(new Flocking.Vector(2.01, 0)),

                new Flocking.Boid(new Flocking.Vector(-1, 0)),
                new Flocking.Boid(new Flocking.Vector(1, 0))
            ];

            var influencers = boid.calculateInfluencers(otherBoids, 2);

            expect(influencers.length).toBe(2);
            expect(influencers[0]).toBe(otherBoids[3]);
            expect(influencers[1]).toBe(otherBoids[4]);
        });
    });

    describe("when no other boids are within a boid's sphere of influence", function () {

        it("there are no influencers", function () {
            var otherBoids = [
                new Flocking.Boid(new Flocking.Vector(-10, 0)),
                new Flocking.Boid(new Flocking.Vector(10, 0)),
            ];

            var influencers = boid.calculateInfluencers(otherBoids, 2);

            expect(influencers.length).toBe(0);
        });
    });
});