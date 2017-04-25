const { removeChildren, createTH } = require("./DOMUtils.js");
const { getLetterRange } = require("./ArrayUtils.js");

class TableView {

  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDOMReference();
    this.renderTable();
  }

  initDOMReference() {
    this.tableHeaderRow = document.querySelector("THEAD TR");
    
  }

  renderTable() {
    this.renderTableHeader();
  }

  renderTableHeader() {
    removeChildren(this.tableHeaderRow);
    getLetterRange('A', this.model.cols)
      .map( letter => createTH(letter) )
      .forEach( TH => this.tableHeaderRow.appendChild(TH) );
  }

}

module.exports = TableView;