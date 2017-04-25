const { removeChildren, createTH, createTR, createTD } = require("./DOMUtils.js");
const { getLetterRange } = require("./ArrayUtils.js");

class TableView {

  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDOMReference();
    this.initCurrentCellLocation();
    this.renderTable();
    this.renderFormulaBar();
    this.attachEventHandlers();
    //TODO REMOVE console.log(`FORMULA BAR ->${this.formulaBar.value}<-`);
    
  }

  initDOMReference() {
    this.tableHeader = document.querySelector("THEAD TR");
    this.tableBody = document.querySelector("TBODY");
    this.formulaBar = document.querySelector("#formula");
    
  }

  initCurrentCellLocation() {
    this.currentCellLocation = { "col": 0, "row": 0 };
  }

  renderFormulaBar() {
    const cellLocationForDisplay = `row ${this.currentCellLocation.row} : col ${this.currentCellLocation.col} `;
    this.formulaBar.placeholder = cellLocationForDisplay;

    this.formulaBar.value = this.model.getValue(this.currentCellLocation) || "";
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
  }

  renderTableHeader() {
    removeChildren(this.tableHeader);
    getLetterRange('A', this.model.cols)
      .map( letter => createTH(letter) )
      .forEach( TH => this.tableHeader.appendChild(TH) );
  }

  isCurrentCell(row, col) {
    return this.currentCellLocation.row === row && this.currentCellLocation.col === col;
  }

  renderTableBody() {
    removeChildren(this.tableBody);
    const fragment = document.createDocumentFragment();

    for (let row=0; row < this.model.rows; row++) {
      const tableRow = createTR();
      
      for (let col=0; col < this.model.cols; col++) {
        const location = {"col": col, "row": row};
        //TODO REMOVE console.log(`Rending row ${row} col ${col} with value ${this.model.getValue(location)}`);
        const tableCell = createTD(this.model.getValue(location));

        if(this.isCurrentCell(row, col))
          tableCell.className = "currentCell";
        tableRow.appendChild(tableCell);
      }
      fragment.appendChild(tableRow);
    }
    this.tableBody.appendChild(fragment);

    
  }

  handleCellClick(event) {
    const col = event.target.cellIndex;
    const row = event.target.parentElement.rowIndex -1;

    this.currentCellLocation = {"col": col, "row": row};
    this.renderTableBody();
    this.renderFormulaBar();
  }

  handleFormulaBarUserInput() {
    this.formulaBar.placeholder = "";
    const userInput = this.formulaBar.value;
    this.model.setValue(this.currentCellLocation, userInput);
    this.renderTableBody();
  }

  attachEventHandlers() {
    this.tableBody.addEventListener("click", this.handleCellClick.bind(this) );
    this.formulaBar.addEventListener("keyup", this.handleFormulaBarUserInput.bind(this) );
  }
}

module.exports = TableView;