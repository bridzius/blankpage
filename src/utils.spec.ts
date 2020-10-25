import { sortCompare } from "./utils";

describe("Blankpage utils", () => {
    describe("#sortCompare", () => {
        it("should sort lower numbers as last", () => {
            const input = [200, 300];
            expect(input.sort(sortCompare)).toEqual([300, 200]);
        });
        it("should sort higher numbers as first", () => {
            const input = [5000, 60000, 1];
            expect(input.sort(sortCompare)).toEqual([60000, 5000, 1]);
        });
        it("should leave identical numbers as is", () => {
            const input = [100, 80, 90, 90];
            expect(input.sort(sortCompare)).toEqual([100, 90, 90, 80]);
        });
    });
});
