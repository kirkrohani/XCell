const getRange = function(fromNum, toNum) {
  return Array.from({length: toNum - fromNum + 1},
    (unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter="A", numOfLetters) {
  const firstLetterCharCode = firstLetter.charCodeAt(0);
  const lastLetterCharCode = firstLetterCharCode + numOfLetters -1;

  return getRange(firstLetterCharCode,lastLetterCharCode)
    .map( charCode => String.fromCharCode(charCode) );
};

const calculateSum = function(array) {
  return array.filter( value => !isNaN(value) )
          .reduce( (sum, curr) => sum += parseInt(curr), 0 );
};

module.exports = {
  getRange: getRange,
  getLetterRange: getLetterRange,
  calculateSum: calculateSum
};

