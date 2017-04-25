document.addEventListener("DOMContentLoaded", (event) => {

  const TableView = require("./TableView.js");
  const TableModel = require("./TableModel.js");

  const model = new TableModel();
  const view = new TableView(model);
  view.init();

});
