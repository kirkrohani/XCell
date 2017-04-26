const TableView = require("../TableView.js");
const TableModel = require("../TableModel.js");
const fs = require("fs");

describe("CLASS TableView Test Suite", () => {

  beforeEach(() => {
    const fixturePath = "./client/js/test/fixtures/sheet-container.html";
    const html = fs.readFileSync(fixturePath, "utf8");
    document.documentElement.innerHTML = html;
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