const ArrayUtils = require("../ArrayUtils.js");
const arrayUtils = new ArrayUtils();


describe("Array Util Test Suite", () => {
  
  describe("FUNCTION getRange() ", () => {
    it("creates an array starting at 0", () => {
      expect(arrayUtils.getRange(0, 5)).toEqual([0,1,2,3,4,5]);
    });

    it("creates an array starting at 1", () => {
      expect(arrayUtils.getRange(1, 3)).toEqual([1,2,3]);
    });

    it("creates an array with negative values", () => {
      expect(arrayUtils.getRange(-10, -7)).toEqual([-10,-9,-8,-7]);
    });
  });

  describe("FUNCTION getLetterRange() ", () => {

    it("creates an array starting of Letters staring at A", () => {
      expect(arrayUtils.getLetterRange( 'A', 4)).toEqual(['A', 'B', 'C', 'D']);
    });

    it("creates an array of Letters tarting at D", () => {
      expect(arrayUtils.getLetterRange( 'D', 4)).toEqual(['D','E','F','G']);
    });

    it("creates a singe letter range", () => {
      expect(arrayUtils.getLetterRange( 'Q', 1)).toEqual(['Q']);
    });
  });

});
