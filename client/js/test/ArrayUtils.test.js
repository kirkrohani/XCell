const { getRange } = require("../ArrayUtils.js");
console.log(`getRange ${getRange}`);

describe("Array Util Test Suite", () => {
  
  describe("getRange function", () => {

    it("creates and array starting at 0", () => {
      expect(getRange(0, 5)).toEqual([0,1,2,3,4,5]);
    });

    it("creates and array starting at 1", () => {
      expect(getRange(1, 3)).toEqual([1,2,3]);
    });

    it("creates and array with negative values", () => {
      expect(getRange(-10, -7)).toEqual([-10,-9,-8,-7]);
    });

  });
});
