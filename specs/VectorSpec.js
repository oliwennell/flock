
describe("Vector", function () {

    var tolerance = 0.001;

    describe("when constructed", function () {

        it("X and Y values match those given", function () {
            var vector = new Flocking.Vector(1, 2.3);

            expect(vector.x).toBe(1);
            expect(vector.y).toBe(2.3);
        });

        it("X and Y default to 0 if unspecified", function () {
            var vector = new Flocking.Vector();

            expect(vector.x).toBe(0);
            expect(vector.y).toBe(0);
        });
    });

    describe("adding a vector", function() {

        it("adds the X and Y values of another vector to the original vector", function () {
            var v1 = new Flocking.Vector(1, 2);
            var v2 = new Flocking.Vector(3, 4);

            v1.add(v2);

            expect(v1.x).toBe(4);
            expect(v1.y).toBe(6);
        });
    });

    describe("subtracting a vector", function () {

        it("subtracts the X and Y values of another vector from the original vector", function () {
            var v1 = new Flocking.Vector(1, 8);
            var v2 = new Flocking.Vector(3, 4);

            v1.subtract(v2);

            expect(v1.x).toBe(-2);
            expect(v1.y).toBe(4);
        });
    });

    describe("multiplying a vector by a scalar", function() {
    
        it("multiplies the vector's X and Y values by the scalar", function() {
            var vector = new Flocking.Vector(2, 4);

            vector.multiplyScalar(2);

            expect(vector.x).toBe(4);
            expect(vector.y).toBe(8);
        });
    });

    describe("dividing a vector by a scalar", function () {

        it("divides the vector's X and Y values by the scalar", function () {
            var vector = new Flocking.Vector(2, 4);

            vector.divideScalar(2);

            expect(vector.x).toBe(1);
            expect(vector.y).toBe(2);
        });
    });

    describe("normalising a vector", function () {

        it("produces a unit vector", function () {
            var vector = new Flocking.Vector(10, 10);

            vector.normalise();

            expect(vector.x * vector.x + vector.y * vector.y).toBeCloseTo(1, tolerance);
        });
    });

    describe("duplicating a vector", function () {

        it("results in a new vector with the same values", function () {
            var original = new Flocking.Vector(1, 2);

            var copy = original.duplicate();

            expect(copy.x).toBe(1);
            expect(copy.y).toBe(2);
        });

        it("results in a new vector that is not the same instance as the original vector", function () {
            var original = new Flocking.Vector(1, 2);

            var copy = original.duplicate();

            expect(copy).toNotBe(original);
        });
    });

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

    describe("length", function () {

        expect(new Flocking.Vector(10, 0).getLength()).toBe(10);
        expect(new Flocking.Vector(20, 0).getLength()).toBe(20);
        expect(new Flocking.Vector(10, 10).getLength()).toBeCloseTo(14.1421, tolerance);

    });

    describe("distance", function () {

        it("is calculated from this vector to another", function () {
            expect(new Flocking.Vector(0, 0).getDistanceTo(new Flocking.Vector(2, 0))).toBeCloseTo(2, tolerance);
            expect(new Flocking.Vector(2, 0).getDistanceTo(new Flocking.Vector(0, 0))).toBeCloseTo(2, tolerance);
            expect(new Flocking.Vector(-1, 0).getDistanceTo(new Flocking.Vector(1, 0))).toBeCloseTo(2, tolerance);
            expect(new Flocking.Vector(0, -1).getDistanceTo(new Flocking.Vector(0, 1))).toBeCloseTo(2, tolerance);

            expect(new Flocking.Vector(0, 0).getDistanceTo(new Flocking.Vector(1, 1))).toBeCloseTo(1, tolerance);
            expect(new Flocking.Vector(1, 1).getDistanceTo(new Flocking.Vector(0, 0))).toBeCloseTo(1, tolerance);
            expect(new Flocking.Vector(0, 0).getDistanceTo(new Flocking.Vector(-1, -1))).toBeCloseTo(1, tolerance);
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

    describe("clamping", function () {

        describe("A vector is clamped", function() {
        
            it("when its length exceeds the maximum", function () {
                var vector = new Flocking.Vector(2, 0);

                vector.clamp(1);

                expect(vector.getLength()).toBe(1);
            });
        });

        describe("A vector is not clamped", function () {

            it("when its length equals the maximum", function () {
                var vector = new Flocking.Vector(1, 0);

                vector.clamp(1);

                expect(vector.getLength()).toBe(1);
            });

            it("when its length is less than the maximum", function () {
                var vector = new Flocking.Vector(0.5, 0);

                vector.clamp(1);

                expect(vector.getLength()).toBe(0.5);
            });
        });
    });
});