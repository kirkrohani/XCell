class ArrayUtils {

  getRange(fromNum, toNum) {
    return Array.from({length: toNum - fromNum + 1},
      (unused, i) => i + fromNum);
  }

  getLetterRange(firstLetter="A", numOfLetters) {
    const firstLetterCharCode = firstLetter.charCodeAt(0);
    const lastLetterCharCode = firstLetterCharCode + numOfLetters -1;

    return this.getRange(firstLetterCharCode,lastLetterCharCode)
      .map( charCode => String.fromCharCode(charCode) );
  }
}

module.exports = ArrayUtils;