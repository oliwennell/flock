
describe("Vector", function () {

    var tolerance = 0.001;

    describe("heading angle", function () {
        
        // 0 radians is line pointing at +X

        it("is calculated for points at the x and y axes", function () {
            expect(new Flocking.Vector(1, 0).getHeading()).toBeCloseTo(0, tolerance);
            expect(new Flocking.Vector(0, 1).getHeading()).toBeCloseTo(Math.PI * 0.5, tolerance);
            expect(new Flocking.Vector(-1, 0).getHeading()).toBeCloseTo(Math.PI, tolerance);
            expect(new Flocking.Vector(0, -1).getHeading()).toBeCloseTo(Math.PI * 1.5, tolerance);
        });

        it("is calculated for points diagonally on positive y axis", function () {
            expect(new Flocking.Vector(1, 1).getHeading()).toBeCloseTo(Math.PI * 0.25, tolerance);
            expect(new Flocking.Vector(-1, 1).getHeading()).toBeCloseTo(Math.PI * 0.75, tolerance);
        });

        it("is calculated for points diagonally on negative y axis", function () {
            expect(new Flocking.Vector(-1, -1).getHeading()).toBeCloseTo(Math.PI * 1.25, tolerance);
            expect(new Flocking.Vector(1, -1).getHeading()).toBeCloseTo(Math.PI * 1.75, tolerance);
        });
    });

    describe("squared distance", function () {

        it("is calculated from this vector to another", function () {
            expect(new Flocking.Vector(0, 0).getSquaredDistanceTo(new Flocking.Vector(2, 0))).toBeCloseTo(4, tolerance);
            expect(new Flocking.Vector(2, 0).getSquaredDistanceTo(new Flocking.Vector(0, 0))).toBeCloseTo(4, tolerance);
            expect(new Flocking.Vector(-1, 0).getSquaredDistanceTo(new Flocking.Vector(1, 0))).toBeCloseTo(4, tolerance);
            expect(new Flocking.Vector(0, -1).getSquaredDistanceTo(new Flocking.Vector(0, 1))).toBeCloseTo(4, tolerance);

            expect(new Flocking.Vector(0, 0).getSquaredDistanceTo(new Flocking.Vector(1, 1))).toBeCloseTo(2, tolerance);
            expect(new Flocking.Vector(1, 1).getSquaredDistanceTo(new Flocking.Vector(0, 0))).toBeCloseTo(2, tolerance);
            expect(new Flocking.Vector(0, 0).getSquaredDistanceTo(new Flocking.Vector(-1, -1))).toBeCloseTo(2, tolerance);
        });
    });
});