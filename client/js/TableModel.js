class TableModel {
  constructor(numOfRows=10, numOfCols=20) {
    this.rows = numOfRows;
    this.cols = numOfCols;
    this.data = {};
    this.columnSums = {};
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

  getColumnSum(col) {
    return this.columnSums[col];
  }

  setColumnSum(col, value) {
    this.columnSums[col] = value;
  }
}

module.exports = TableModel;