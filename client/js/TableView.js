const { removeChildren, createTH, createTR, createTD } = require("./DOMUtils.js");
const { getLetterRange, calculateSum } = require("./ArrayUtils.js");

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
    
  }

  initDOMReference() {
    this.tableHeader = document.querySelector("THEAD TR");
    this.tableBody = document.querySelector("TBODY");
    this.tableFooter = document.querySelector("TFOOT TR");
    this.formulaBar = document.querySelector("#formula");
    this.addRowButton = document.querySelector("#addRow");
    this.addColButton = document.querySelector("#addCol");

    
  }

  initCurrentCellLocation() {
    this.currentCellLocation = { "col": 0, "row": 0 };
  }

  isCurrentCell(row, col) {
    return this.currentCellLocation.row === row && this.currentCellLocation.col === col;
  }

  _displayFormat(item) {
    return ( (item === undefined || item === null) ) ? "" : item.toString();
  }

  renderFormulaBar() {
    const cellLocationToDisplayAsPlaceHolder = `row ${this.currentCellLocation.row} : col ${this.currentCellLocation.col} `;
    this.formulaBar.placeholder = cellLocationToDisplayAsPlaceHolder;
    this.formulaBar.value = this.model.getValue(this.currentCellLocation) || "";
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFooter();
  }

  renderNewRow(location) {
    console.log(`calling renderNewLocation with location ${location}`);
    //create a new TR
    const tableRow = createTR();
    
    //loop through number of cols
    for (let col=0; col < this.model.cols; col++) {
      const tableCell = createTD();
      tableRow.appendChild(tableCell);
    }

    if (location) {
      //do something
    } else {
      this.tableBody.appendChild(tableRow);
    } 
    this.model.rows = this.model.rows + 1;
  }

  renderNewColumn(location) {
    console.log(`Calling renderNewColumn with location ${location}`);

    if(location) {
      const tableRows = this.tableBody.childNodes;

    //loop through tbody child nodes

      //grab TR
      //create new TD
      //append new TD to TR
    } else {
      this.model.cols = this.model.cols + 1;
      this.renderTable();
    }
  }

  renderTableHeader() {
    const fragment = document.createDocumentFragment();

    removeChildren(this.tableHeader);
    getLetterRange('A', this.model.cols)
      .map( letter => createTH(letter) )
      .forEach( TH => fragment.appendChild(TH) );

    this.tableHeader.appendChild(fragment);
  }

  renderTableFooter() {
    const fragment = document.createDocumentFragment();
    
    removeChildren(this.tableFooter);
    for (let col=0; col < this.model.cols; col++) {
      const tableCell = createTD(this._displayFormat(this.model.getColumnSum(col)) || "");
      fragment.appendChild(tableCell);
    }

    this.tableFooter.appendChild(fragment);
  }

  renderTableBody() {
    removeChildren(this.tableBody);
    const fragment = document.createDocumentFragment();

    for (let row=0; row < this.model.rows; row++) {
      const tableRow = createTR();
      
      for (let col=0; col < this.model.cols; col++) {
        const location = {"col": col, "row": row};
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

  _isValidNumericalInput(userInput) {

    //one-off wierd scenarion when user enters -5 and then simply deletes the 5 and leaves
    //the dash. In this scenario we need to re-calculate still.
    return (!isNaN(userInput) || userInput === '-');
  }

  _setNewColumnSum(userInput) {
    if (this._isValidNumericalInput(userInput)) {
      
      let columnDataValues = this.model.getColumnValues(this.currentCellLocation.col);
      const sum = calculateSum(columnDataValues);      
      this.model.setColumnSum(this.currentCellLocation.col, sum);
    }
  }

  handleFormulaBarUserInput() {
    this.formulaBar.placeholder = "";
    const userInput = this.formulaBar.value;

    this.model.setValue(this.currentCellLocation, userInput);
    this._setNewColumnSum(userInput);

    this.renderTableBody();
    this.renderTableFooter();
  }

  handleAddRowButtonClick() {
    console.log("add a new ROW");
    this.renderNewRow();
  }

  handleAddColButtonClick() {
      console.log("add a new COL");
      this.renderNewColumn();

  }  

  attachEventHandlers() {
    this.tableBody.addEventListener("click", this.handleCellClick.bind(this) );
    this.formulaBar.addEventListener("keyup", this.handleFormulaBarUserInput.bind(this) );
    this.addRowButton.addEventListener("click", this.handleAddRowButtonClick.bind(this) );
    this.addColButton.addEventListener("click", this.handleAddColButtonClick.bind(this) );

  }
}

module.exports = TableView;