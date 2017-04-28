const { getRange } = require("./ArrayUtils.js");

class TableModel {
  constructor(numOfRows=2, numOfCols=2) {
    this.rows = numOfRows;
    this.cols = numOfCols;
    this.data = {};
   // this.columnSums = {};
  }

  _getCellId(location) {
    return `${location.col}:${location.row}`;
  }

  getValue(location) {
    return this.data[this._getCellId(location)];
  }

  setValue(location, value) {
    this.data[this._getCellId(location)] = value;
  }

  // getColumnSum(col) {
  //   return this.columnSums[col];
  // }

  // setColumnSum(col, value) {
  //   this.columnSums[col] = value;
  // }

  getColumnValues(col) {
    return getRange(0, this.rows-1)
            .map( row => this.getValue({"col": col, "row": row}) );
  }

}

module.exports = TableModel;