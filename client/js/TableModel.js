const { getRange } = require("./ArrayUtils.js");

class TableModel {
  constructor(numOfRows=3, numOfCols=3) {
    this.rows = numOfRows;
    this.cols = numOfCols;
    this.data = {};
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

  getColumnValues(col) {
    return getRange(0, this.rows-1)
            .map( row => this.getValue({"col": col, "row": row}) );
  }

}

module.exports = TableModel;