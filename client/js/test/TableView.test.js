const TableView = require("../TableView.js");
const TableModel = require("../TableModel.js");
const fs = require("fs");

describe("CLASS TableView Test Suite", () => {

  beforeEach(() => {
    const fixturePath = "./client/js/test/fixtures/sheet-container.html";
    const html = fs.readFileSync(fixturePath, "utf8");
    document.documentElement.innerHTML = html;
  });

  describe("Test Table Buttons - addRow", () => {
    it("adds a new rown when addRow button clicked", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      expect(view.tableBody.childNodes.length).toEqual(5);
      const addRowButton = document.querySelector("#addRow");
      addRowButton.click();
      expect(view.tableBody.childNodes.length).toEqual(6);
      expect(model.rows).toEqual(6);
    });

    it("adds a column when addColumn button clicked", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      expect(view.tableBody.childNodes[0].childNodes.length).toEqual(5);
      const addColButton = document.querySelector("#addCol");
      addColButton.click();
      expect(view.tableBody.childNodes[0].childNodes.length).toEqual(6);
      expect(model.cols).toEqual(6);
    });

    it("adds a new row at a specific location", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      let tableBody = document.querySelector("#sheet TBODY");
      expect(tableBody.childNodes.length).toEqual(5);

      view.insertNewRow(1);
      view.renderTable();
      tableBody = document.querySelector("#sheet TBODY");
      expect(tableBody.childNodes.length).toEqual(6);
    });

    it("adds a new column at a specific location", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      const tableBody = document.querySelector("#sheet TBODY");
      expect(tableBody.childNodes[1].childNodes.length).toEqual(5);

      model.setValue({"col":1, "row":0}, 6);
      model.setValue({"col":1, "row":1}, 7);
      model.setValue({"col":1, "row":2}, 8);
      model.setValue({"col":1, "row":3}, 9);
      model.setValue({"col":1, "row":4}, 10);
      

      let tableCell = document.querySelector("#sheet THEAD TR");
      tableCell.childNodes[0].click();
      const insertColButton = document.querySelector("#addCol");
      insertColButton.click();
      
      expect(tableBody.childNodes[1].childNodes.length).toEqual(6);
      expect(tableBody.childNodes[0].childNodes[2].textContent).toEqual("6");

    });
  });

  describe("Test Table Header", () => {
    it("has valid header row labels", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      let tableHeaderRow = document.querySelector("#sheet THEAD TR");
      expect(tableHeaderRow.childNodes.length).toEqual(model.cols);

      let cellValues = Array.from(tableHeaderRow.childNodes)
        .map( node => node.textContent );
      expect(cellValues).toEqual(['A', 'B', 'C', 'D', 'E']);
    });

    it("clicking table header row highlights current column", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();
      
      let tableHeaderCell = document.querySelector("#sheet THEAD TR").childNodes[1];
      expect(tableHeaderCell.className).toBe("");

      tableHeaderCell.click();
      tableHeaderCell = document.querySelector("#sheet THEAD TR").childNodes[1];
      expect(tableHeaderCell.className).toBe("selectedHeader");

      const tableBodyCell = document.querySelector("#sheet TBODY").childNodes[1].childNodes[1];
      expect(tableBodyCell.className).toBe("selectedCell");
    });

  });

  describe("Test Table Number Column", () => {
    it("has valid header column labels", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      let tableNumberColumnBody = document.querySelector("#number_column TBODY");
      expect(tableNumberColumnBody.childNodes.length).toEqual(model.rows);

      let cellValues = Array.from(tableNumberColumnBody.childNodes)
        .map( tableRow => tableRow.childNodes[0].textContent );
      expect(cellValues).toEqual(['1', '2', '3', '4', '5']);
    });

    it("clicking table number column highlights current row", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();
      
      let tableHeaderCell = document.querySelector("#number_column TBODY").childNodes[1].childNodes[0];
      expect(tableHeaderCell.className).toBe("numberColumn");

      tableHeaderCell.click();
      tableHeaderCell = document.querySelector("#number_column TBODY").childNodes[1].childNodes[0];
      expect(tableHeaderCell.className).toBe("selectedNumberColumn");

      const tableBodyCell = document.querySelector("#sheet TBODY").childNodes[1].childNodes[1];
      expect(tableBodyCell.className).toBe("selectedCell");
    });
  });

  describe("Test Table Footer", () => {
    it("has a valid footer row", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      let tableFooterRow = document.querySelector("#sheet TFOOT TR");
      expect(tableFooterRow.childNodes).not.toBeNull();
      expect(tableFooterRow.childNodes.length).toEqual(model.cols);
    });

    it("displays sum after user inputs number into a column", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      const tableBody = document.querySelector("#sheet TBODY");
      let tableCell = tableBody.childNodes[1].childNodes[1];
      
      tableCell.click();
      view.formulaBar.value = 12;
      view.handleFormulaBarUserInput();

      
      let tableFooterRow = document.querySelector("#sheet TFOOT TR");
      expect(tableFooterRow.childNodes[1].textContent).toEqual("12");
      
    });
  });

  describe("Test Table Body", () => {
    it("has the right number of rows and columns", () => {
      const model = new TableModel(10, 4);
      const view = new TableView(model);
      view.init();

      let tableBody = document.querySelector("#sheet TBODY");
      expect(tableBody.childNodes.length).toEqual(model.rows);
      expect(tableBody.childNodes[0].childNodes.length).toEqual(model.cols);
    });

    it("has the same data as in the model", () => {
      const model = new TableModel(10, 4);
      const view = new TableView(model);
      const location = {"col":0, "row":0};
      model.setValue(location, 101);
      view.init();

      let tableBody = document.querySelector("#sheet TBODY");
      expect(tableBody.childNodes[0].childNodes[0].textContent).toEqual('101');
    });

    it("highlights the cell when clicked", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      const tableBody = document.querySelector("#sheet TBODY");
      let tableCell = tableBody.childNodes[1].childNodes[1];
      expect(tableCell.className).toBe("");

      tableCell.click();
      tableCell = tableBody.childNodes[1].childNodes[1];
      expect(tableCell.className).not.toBe("");
    });
  });

  describe("Test Formula Bar", () => {
    it("updates the formula bar when user clicks a cell with data", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      const formulaBar = document.querySelector("#formula");
      expect(formulaBar.value).toBe("");

      
      model.setValue({"col": 1, "row": 1}, 35);
      const tableCell = document.querySelector("#sheet TBODY").childNodes[1].childNodes[1];
      tableCell.click();
      expect(formulaBar.value).toBe("35");
    });

    it("updates the cell when input entered into formula bar", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      const formulaBar = document.querySelector("#formula");
      expect(formulaBar.value).toBe("");

      const tableCell = document.querySelector("#sheet TBODY").childNodes[1].childNodes[1];
      tableCell.click();
      
      formulaBar.value = "kirk";
      view.handleFormulaBarUserInput();

      expect(model.getValue({"col": 1, "row": 1})).toBe("kirk");
    });
  });

  describe("Test Sum Formula", () => {
    it("Allows entry of a sum formula into the formula bar", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      model.setValue({"col": 0, "row": 0}, 3);
      model.setValue({"col": 0, "row": 1}, 12);
      let tableCell = document.querySelector("#sheet TBODY").childNodes[2].childNodes[0];
      tableCell.click();
      view.formulaBar.value = "=SUM(A1:A2)";
      view.handleFormulaBarUserInput();
      expect(model.getValue({"col":0,"row":2})).toEqual("=SUM(A1:A2)");
    });

    it("calculates the proper sum and displays the result in the cell window", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      model.setValue({"col": 0, "row": 0}, 3);
      model.setValue({"col": 0, "row": 1}, 12);
      let tableCell = document.querySelector("#sheet TBODY").childNodes[2].childNodes[0];
      tableCell.click();
      view.formulaBar.value = "=SUM(A1:A2)";
      view.handleFormulaBarUserInput();
      expect(model.getValue({"col":0,"row":2})).toEqual("=SUM(A1:A2)");
      tableCell = document.querySelector("#sheet TBODY").childNodes[2].childNodes[0];
      expect(tableCell.textContent).toEqual("15");
    });

  });

});