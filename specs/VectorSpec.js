
describe("Vector", function () {

    describe("heading angle", function () {
        var tolerance = 0.001;

        // 0 radians is angle formed by line from [x:0, y:0] to [x:1, y:0]

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
});