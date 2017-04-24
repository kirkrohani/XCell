const TableModel = require("../TableModel");

describe("CLASS Table Model Test Suite", () => {

  const model = new TableModel();
  const location = {row: 3, col: 5};

  describe("Test intitial table state", () => {
    it("Test if initial state undefined", () => {
      expect(model.getValue(location)).toBeUndefined();
    });
  });

  describe("Test getting and setting values", () => {
    it("Set value using setValue() and then getValue() ", () => {
      const value = "Hello George";
      model.setValue(location, value);
      expect(model.getValue(location)).toEqual(value);
    });
  });

});