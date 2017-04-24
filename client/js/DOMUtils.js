const removeChildren = function(parentElement) {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
};

const createElement = function(elementType) {
  return function(text) {
    const newElement = document.createElement(elementType);

    if (text) {
      newElement.textContent = text;
    }

    return newElement;
  };
};

const createTR = createElement("TR");
const createTH = createElement("TH");
const createTD = createElement("TD");

module.exports = {
  createTD: createTD,
  createTH: createTH,
  createTR: createTR,
  removeChildren: removeChildren
};