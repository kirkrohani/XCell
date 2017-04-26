const TableModel = require("../TableModel");

describe("CLASS Table Model Test Suite", () => {

  const model = new TableModel(3,5);
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

  describe("Test getting and setting column sums", () => {
    it("sets the column sum and retrieves the column sum ", () => {
      const value = 45;
      const column = 2;
      model.setColumnSum(column, value);
      expect(model.getColumnSum(column)).toEqual(value);
    });
  });

  describe("Test getting column values", () => {
    it("sets the column data to some values  and retrieves the column data for that column ", () => {
      let value = 1;
      const column = 2;
      for (let row=0; row < model.rows; row++) {
        model.setValue({"col": column, "row": row}, value++);
      }

      expect(model.getColumnValues(column)).toEqual([1,2,3]);
      expect(model.getColumnValues(column+1)).toEqual([undefined, undefined, undefined]);
      
    });
  });

});