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

const calculateArraySum = function(array) {
  let filtered =  array.filter( value => (!isNaN(value) && value !== "") );

  return (!filtered.length) ? "" : filtered.reduce( (sum, curr) =>  sum += parseFloat(curr), 0);
};

module.exports = {
  getRange: getRange,
  getLetterRange: getLetterRange,
  calculateArraySum: calculateArraySum
};

