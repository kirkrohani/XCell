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

    // it("adds a column when add column button clicked", () => {
    //   const model = new TableModel(5, 5);
    //   const view = new TableView(model);
    //   view.init();

    //   expect(view.tableBody.childNodes[0].childNodes.length).toEqual(5);
    //   const addColButton = document.querySelector("#addCol");
    //   addColButton.click();
    //   expect(view.tableBody.childNodes[0].childNodes.length).toEqual(6);
    //   expect(model.cols).toEqual(6);
    // });

    it("adds a new row at a specific location", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      const tableBody = document.querySelector("TBODY");
      expect(tableBody.childNodes.length).toEqual(5);

      view.insertNewRow(1);
      expect(tableBody.childNodes.length).toEqual(6);
    });

    it("adds a new column at a specific location", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      const tableBody = document.querySelector("TBODY");
      expect(tableBody.childNodes[1].childNodes.length).toEqual(5);

      model.setValue({"col":1, "row":0}, 6);
      model.setValue({"col":1, "row":1}, 7);
      model.setValue({"col":1, "row":2}, 8);
      model.setValue({"col":1, "row":3}, 9);
      model.setValue({"col":1, "row":4}, 10);
      console.log(model.getValue({"col":1, "row":0}));
      view.insertNewColumn();
    });



  });


  describe("Test Table Header", () => {
    it("has valid header row labels", () => {
      const model = new TableModel(10, 4);
      const view = new TableView(model);
      view.init();

      let tableHeaderRow = document.querySelector("THEAD TR");
      expect(tableHeaderRow.childNodes.length).toEqual(model.cols);

      let cellValues = Array.from(tableHeaderRow.childNodes)
        .map( node => node.textContent );
      expect(cellValues).toEqual(['A', 'B', 'C', 'D']);
    });

    it("clicking table header row highlights current column", () => {

      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();
      
      let tableHeaderCell = document.querySelector("THEAD TR").childNodes[1];
      expect(tableHeaderCell.className).toBe("");

      tableHeaderCell.click();
      tableHeaderCell = document.querySelector("THEAD TR").childNodes[1];
      expect(tableHeaderCell.className).toBe("currentHeader");

      const tableBodyCell = document.querySelector("TBODY").childNodes[1].childNodes[1];
      expect(tableBodyCell.className).toBe("currentCell");
    });


  });

  describe("Test Table Footer", () => {

    it("has a valid footer row", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      let tableFooterRow = document.querySelector("tfoot tr");
      expect(tableFooterRow.childNodes).not.toBeNull();
      expect(tableFooterRow.childNodes.length).toEqual(model.cols);
    });

    it("displays sum after user inputs number into a column", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      const tableBody = document.querySelector("TBODY");
      let tableCell = tableBody.childNodes[1].childNodes[1];
      
      tableCell.click();
      view.formulaBar.value = 12;
      view.handleFormulaBarUserInput();

      
      let tableFooterRow = document.querySelector("TFOOT TR");
      expect(tableFooterRow.childNodes[1].textContent).toEqual("12");
      
    });

  });

  describe("Test Table Body", () => {
    it("has the right number of rows and columns", () => {
      const model = new TableModel(10, 4);
      const view = new TableView(model);
      view.init();

      let tableBody = document.querySelector("TBODY");
      expect(tableBody.childNodes.length).toEqual(model.rows);
      expect(tableBody.childNodes[0].childNodes.length).toEqual(model.cols);
    });

    it("has the same data as in the model", () => {
      const model = new TableModel(10, 4);
      const view = new TableView(model);
      const location = {"col":0, "row":0};
      model.setValue(location, 101);
      view.init();

      let tableBody = document.querySelector("TBODY");
      
      expect(tableBody.childNodes[0].childNodes[0].textContent).toEqual('101');
    });

    it("highlights the cell when clicked", () => {
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init();

      const tableBody = document.querySelector("TBODY");
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
      const tableCell = document.querySelector("TBODY").childNodes[1].childNodes[1];
      tableCell.click();
      expect(formulaBar.value).toBe("35");
    });


    it("updates the cell when input entered into formula bar", () => {
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      const formulaBar = document.querySelector("#formula");
      expect(formulaBar.value).toBe("");

      const tableCell = document.querySelector("TBODY").childNodes[1].childNodes[1];
      tableCell.click();
      
      formulaBar.value = "kirk";
      view.handleFormulaBarUserInput();

      expect(model.getValue({"col": 1, "row": 1})).toBe("kirk");
    });
  });

});