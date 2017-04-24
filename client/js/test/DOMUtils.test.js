const { createTH, createTR, createTD, removeChildren } = require("../DOMUtils.js");

describe("Test Suite for DOM Utils", () => {

  describe("FUNCTION removeChildren()", () => {
    it("Test removing all children", () => {
      //create initial structure
      const parent = document.createElement("div");
      const child1 = document.createElement("span");
      const child2 = document.createElement("span");
      parent.appendChild(child1);
      parent.appendChild(child2);

      //validate initial structure
      expect(parent.childNodes.length).toEqual(2);
      expect(parent.childNodes[0]).toEqual(child1);

      //test function and re-validate structure
      removeChildren(parent);
      expect(parent.childNodes.length).toEqual(0);
    });
  });

  describe("FUNCTION createTH", () => {
    it("Test creation a TH Tag", () => {
      const element = createTH();
      expect(element.tagName).toBe("TH");
    });

    it("Test adding content value to TH", () => {
      const text = "What in sam hill is going on oaround here?!?";
      const element = createTH(text);
      expect(element.textContent).toEqual(text);
    });
  });
  
  describe("FUNCTION createTD", () => {
    it("Test creation a TD Tag", () => {
      const element = createTD();
      expect(element.tagName).toBe("TD");
    });
  });

  describe("FUNCTION createTR", () => {
    it("Test creation a TR Tag", () => {
      const element = createTR();
      expect(element.tagName).toBe("TR");
    });
  });

});