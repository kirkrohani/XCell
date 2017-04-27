const { removeChildren, createTH, createTR, createTD } = require("./DOMUtils.js");
const { getLetterRange, calculateArraySum } = require("./ArrayUtils.js");

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
    if (this.currentCellLocation.row === -1) {
      return this.currentCellLocation.col === col;
    } else {
      return this.currentCellLocation.row === row && this.currentCellLocation.col === col;
    }
  }

  _displayFormat(item) {
    return ( (item === undefined || item === null) ) ? "" : item.toString();
  }

  _calculateColumnSum(col) {
    return calculateArraySum(this.model.getColumnValues(col));  
  }

  _createNewRow() {
    const tableRow = createTR();
    for ( let col=0; col < this.model.cols; col++) {
      const tableCell = createTD();
      tableRow.appendChild(tableCell);
    }
    return tableRow;
  }

  insertNewRow(insertionPoint) {
    console.log('inserting new row at row ', insertionPoint);
    this.model.rows = this.model.rows + 1;
    const tableRow = this.tableBody.childNodes[insertionPoint];
    this.tableBody.insertBefore(this._createNewRow(), tableRow);
  }

  _shiftColumnData(endingColumn) {
    let previousLocation, newLocation;

    for (let col=this.model.cols-1; col >= endingColumn; col--) {
      for (let row=0; row < this.model.rows; row++) {
        previousLocation = {"col": col, "row": row};
        newLocation = {"col": col+1, "row": row};
        this.model.setValue(newLocation, this.model.getValue(previousLocation));

        if (col === endingColumn) {
          this.model.setValue(previousLocation, undefined);
        }
      }
    }
  }

  _shiftColumnSums(startingColumn) {
    this.model.setColumnSum(startingColumn, "");
    for (let col=startingColumn+1; col < this.model.cols; col++) {
      this.model.setColumnSum(col, this._calculateColumnSum(col) );
    }
  }

  insertNewColumn(insertionPoint) {
    console.log('insertNewColumn at: ', insertionPoint);

    this.model.cols = this.model.cols + 1;
    if (insertionPoint !== this.model.cols) {
      this._shiftColumnData(insertionPoint+1);
      this._shiftColumnSums(insertionPoint+1);
    }
    this.renderTable();
  }

  renderFormulaBar() {
    if (this.currentCellLocation.row !== -1) {
      const cellLocationToDisplayAsPlaceHolder = `row ${this.currentCellLocation.row} : col ${this.currentCellLocation.col} `;
      this.formulaBar.placeholder = cellLocationToDisplayAsPlaceHolder;
      this.formulaBar.value = this.model.getValue(this.currentCellLocation) || "";
    } else {
      this.formulaBar.value = "";
    }
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFooter();
  }


  renderTableHeader() {
    const fragment = document.createDocumentFragment();

    removeChildren(this.tableHeader);
    getLetterRange('A', this.model.cols)
      .map( (letter, index) => {
        const tableHeader = createTH(letter);
        if (this.currentCellLocation.row === -1 && index === this.currentCellLocation.col){
          tableHeader.className = "currentHeader";
        } 
        return tableHeader;
      })
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

  _isValidNumericalInput(userInput) {

    //one-off wierd scenarion when user enters -5 and then simply deletes the 5 and leaves
    //the dash. In this scenario we need to re-calculate still.
    return (!isNaN(userInput) || userInput === '-');
  }

  // _setColumnNewSum(dataInFormulaBar) {
  //   if (this._isValidNumericalInput(dataInFormulaBar)) {
  //     const currentColumn = this.currentCellLocation.col;
         
  //     this.model.setColumnSum(currentColumn, this._calculateColumnSum(currentColumn) );
  //   }
  // }

  handleFormulaBarUserInput() {
    this.formulaBar.placeholder = "";
    const userInput = this.formulaBar.value;

    this.model.setValue(this.currentCellLocation, userInput);
    //this._setColumnNewSum(userInput);
    if (this._isValidNumericalInput(userInput)) {
      const currentColumn = this.currentCellLocation.col;
      this.model.setColumnSum(currentColumn, this._calculateColumnSum(currentColumn) );
    }

    this.renderTableBody();
    this.renderTableFooter();
  }

  handleCellClick(event) {
    const col = event.target.cellIndex;
    const row = event.target.parentElement.rowIndex -1;

    console.log(`user clicked cell row:${row} col:${col}`);

    this.currentCellLocation = {"col": col, "row": row};    
    this.renderTableHeader();
    this.renderTableBody();
    this.renderFormulaBar();
  }

  handleAddRowButtonClick() {
    console.log("add a new ROW");
    const rowInsertionPoint = (this.currentCellLocation.col === -1) ? this.currentCellLocation.row : this.model.rows;
    this.insertNewRow(rowInsertionPoint);
  }

  handleAddColButtonClick() {
    console.log("add a new COL");
    const columnInsertionPoint = (this.currentCellLocation.row === -1) ? this.currentCellLocation.col : this.model.cols;
    //this.renderNewColumn();
    this.insertNewColumn(columnInsertionPoint);

  }  

  attachEventHandlers() {
    this.tableHeader.addEventListener("click", this.handleCellClick.bind(this) );
    this.tableBody.addEventListener("click", this.handleCellClick.bind(this) );
    this.formulaBar.addEventListener("keyup", this.handleFormulaBarUserInput.bind(this) );
    this.addRowButton.addEventListener("click", this.handleAddRowButtonClick.bind(this) );
    this.addColButton.addEventListener("click", this.handleAddColButtonClick.bind(this) );

  }
}

module.exports = TableView;