const { removeChildren, createTH, createTR, createTD } = require("./DOMUtils.js");
const { getLetterRange } = require("./ArrayUtils.js");

class TableView {

  constructor(model) {
    this.model = model;
    this.NUMBER_COLUMN_HEADER_CLASSNAME = "numberColumnHeader";
    this.NUMBER_COLUMN_FOOTER_CLASSNAME = "numberColumnFooter";
    this.NUMBER_COLUMN_SELECTED_CLASSNAME = "selectedNumberColumn";
    this.NUMBER_COLUMN_CLASSNAME = "numberColumn";
    this.SELECTED_HEADER_CLASSNAME = "selectedHeader";
    this.SELECTED_CELL_CLASSNAME = "selectedCell";
  }

  init() {
    this.initDOMReference();
    this.initCurrentCellLocation();
    this.renderTable();
    this.renderFormulaBar();
    this.attachEventHandlers();
    
  }

  initDOMReference() {
    this.tableHeader = document.querySelector("#sheet THEAD TR");
    this.tableBody = document.querySelector("#sheet TBODY");
    this.tableFooter = document.querySelector("#sheet TFOOT TR");
    this.tableNumberColumnBody = document.querySelector("#number_column TBODY");
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
    } else if (this.currentCellLocation.col === -1) {
      return this.currentCellLocation.row === row;
    } else {
      return (this.currentCellLocation.row === row && this.currentCellLocation.col === col);
    }
  }

  _displayFormat(item) {
    return (item === undefined) ? "" : item.toString();
  }

  _shiftRowData(endRow) {
    let previousLocation, newLocation;

    for (let row = this.model.rows-2; row >= endRow; row-- ) {
      for (let col = 0; col < this.model.cols; col++) {

        previousLocation = {"col": col, "row": row};
        newLocation = {"col": col, "row": row+1};
        this.model.setValue(newLocation, this.model.getValue(previousLocation));

        if (row === endRow) {
          this.model.setValue(previousLocation, undefined);
        }
      } //end inner for loop
    } //end outer for loop
  }

  insertNewRow(insertionPoint) {
    this.model.rows = this.model.rows + 1;
    if (insertionPoint < this.model.rows-1) {
      this._shiftRowData(insertionPoint+1);
    } 
  }


  _shiftColumnData(endColumn) {
    let previousLocation, newLocation;

    for (let col=this.model.cols-1; col >= endColumn; col--) {
      for (let row=0; row < this.model.rows; row++) {
        previousLocation = {"col": col, "row": row};
        newLocation = {"col": col+1, "row": row};
        this.model.setValue(newLocation, this.model.getValue(previousLocation));

        if (col === endColumn) {
          this.model.setValue(previousLocation, undefined);
        }
      }
    }
  }

  insertNewColumn(insertionPoint) {
    this.model.cols = this.model.cols + 1;
    if (insertionPoint < this.model.cols-1) {
      this._shiftColumnData(insertionPoint+1);
    }
  }

  renderFormulaBar() {
    this.formulaBar.placeholder = (this.currentCellLocation.row === -1 || this.currentCellLocation.col === -1) ?  "" : `row ${this.currentCellLocation.row} : col ${this.currentCellLocation.col} `;
    this.formulaBar.value = this.model.getValue(this.currentCellLocation) || "";
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFooter();
    this.renderNumberColumn();
  }

  _renderNumberColumnCell(siblingNode, styling) {
    let tableRow, tableCell;

    removeChildren(this.tableNumberColumnBody[siblingNode]);
    tableRow = createTR();
    tableCell = createTD();
    tableCell.className = styling;
    tableRow.appendChild(tableCell);
    this.tableNumberColumnBody[siblingNode].appendChild(tableRow);
  }

  renderNumberColumnHeader() {
    this._renderNumberColumnCell("previousElementSibling", this.NUMBER_COLUMN_HEADER_CLASSNAME);
  }

  renderNumberColumnFooter() {
    this._renderNumberColumnCell("nextElementSibling", this.NUMBER_COLUMN_FOOTER_CLASSNAME);
  }

  renderNumberColumnBody() {
    let tableCell, tableRow;

    removeChildren(this.tableNumberColumnBody);
    for( let row=0; row < this.model.rows; row++) {
      tableRow = createTR();
      tableCell = createTD( (row+1).toString());
      if (this.isCurrentCell(row, null)) {
        tableCell.className = this.NUMBER_COLUMN_SELECTED_CLASSNAME;
      } else {
        tableCell.className = this.NUMBER_COLUMN_CLASSNAME;
      }
      
      tableRow.appendChild(tableCell);
      this.tableNumberColumnBody.appendChild(tableRow);
    }
  }
    
  renderNumberColumn() {
    this.renderNumberColumnBody();
    this.renderNumberColumnHeader();
    this.renderNumberColumnFooter();
  }

  renderTableHeader() {
    const fragment = document.createDocumentFragment();

    removeChildren(this.tableHeader);
    getLetterRange('A', this.model.cols)
      .map( (letter, index) => {
        const tableHeader = createTH(letter);
        if (this.currentCellLocation.row === -1 && ( index === this.currentCellLocation.col)) {
          tableHeader.className = this.SELECTED_HEADER_CLASSNAME;
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
      let value = this.calculateSum(this.model.getColumnValues(col));
      const tableCell = createTD( this._displayFormat(value));
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
        let data = this.model.getValue(location);
        if (this._isFormula(data)) {
          data = this.executeFormula(data);
        }

        const tableCell = createTD(this._displayFormat(data));

        if(this.isCurrentCell(row, col))
          tableCell.className = this.SELECTED_CELL_CLASSNAME;
        tableRow.appendChild(tableCell);
      }
      fragment.appendChild(tableRow);
    }
    this.tableBody.appendChild(fragment);
  }

  _isValidNumericalInput(userInput) {
    return (!isNaN(userInput) || userInput === '-' || this._isFormula(userInput));
  }

  _isFormula(userInput) {
    const regex = /^=SUM\([A-Za-z]\d{1,2}:[A-Za-z]\d{1,2}\)$/g;
    return regex.test(userInput);
  }

  _convertCellCoordinatesToLocation(coordinate) {
    const col = coordinate[0].charCodeAt(0)-65;
    return {"col": col, "row": parseInt(coordinate.substring(1)-1)};
  }

  _parseUserInput(input) {
    const firstParenIndex = input.indexOf("(");
    const secondParenIndex = input.indexOf(")");
    input = input.substring(firstParenIndex+1, secondParenIndex);
    const tableCellCoords = input.split(":");

    return [this._convertCellCoordinatesToLocation(tableCellCoords[0]), this._convertCellCoordinatesToLocation(tableCellCoords[1])];
  }

  calculateSum(array) {
    let filtered =  array.filter( item => ( this._isFormula(item) || (!isNaN(item) && item !== "")) );

    if (!filtered.length) {
      return "";
    } else {
      return filtered.reduce( (sum, curr) =>  {
        curr = this._isFormula(curr) ? curr = this.executeFormula(curr) : curr;
        if (curr !== "")  sum += parseFloat(curr); 
        return sum;
      }, 0);
    }
  }

  executeFormula(input) {
    const formulaInputs = this._parseUserInput(input);
    const columnToSum = formulaInputs[0].col;
    const dataStartingIndex = formulaInputs[0].row;
    const dataEndingIndex = formulaInputs[1].row + 1;
    const allDataFromCol = this.model.getColumnValues(columnToSum);
    const colDataSubset = allDataFromCol.slice(dataStartingIndex, dataEndingIndex);

    let sum = this.calculateSum(colDataSubset);
    return (sum === "") ? 0 : sum;
  }

  handleFormulaBarUserInput() {
    const userInput = this.formulaBar.value;
    this.model.setValue(this.currentCellLocation, userInput);
    this.renderTable();
  }

  handleNumberColumnClick(event) {
    this.handleCellClick(event, -1);
    
  }

  handleCellClick(event, column) {
    let col = column === undefined ? event.target.cellIndex : column;
    let row = event.target.parentElement.rowIndex -1;

    //console.log(`user clicked cell row:${row} col:${col}`);
    this.currentCellLocation = {"col": col, "row": row};    
    this.renderTable();
    this.renderFormulaBar();
  }

  handleAddRowButtonClick() {
    const rowInsertionPoint = (this.currentCellLocation.col === -1) ? this.currentCellLocation.row : this.model.rows;
    this.insertNewRow(rowInsertionPoint);
    this.renderTable();
  }

  handleAddColButtonClick() {
    const columnInsertionPoint = (this.currentCellLocation.row === -1) ? this.currentCellLocation.col : this.model.cols;
    this.insertNewColumn(columnInsertionPoint);
    this.renderTable();
  }  

  attachEventHandlers() {
    this.tableHeader.addEventListener("click", this.handleCellClick.bind(this) );
    this.tableBody.addEventListener("click", this.handleCellClick.bind(this) );
    this.tableNumberColumnBody.addEventListener("click", this.handleNumberColumnClick.bind(this));
    this.formulaBar.addEventListener("keyup", this.handleFormulaBarUserInput.bind(this) );
    this.addRowButton.addEventListener("click", this.handleAddRowButtonClick.bind(this) );
    this.addColButton.addEventListener("click", this.handleAddColButtonClick.bind(this) );

  }
}

module.exports = TableView;