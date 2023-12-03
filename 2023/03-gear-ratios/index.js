const input = require("./input.js");

// break up the schematic into a 2d array
const twoDArray = input.split("\n").map((row) => row.split(""));

// parse out the numbers
const twoDNumbers = input.split("\n").map((row, rowNum) =>
  [...row.matchAll(/([0-9])+/g)].map((result) => ({
    index: result.index,
    value: result[0],
    rowNum,
  }))
);

const symbolRegex = new RegExp(/([0-9]|\.)/);

const checkFullRow = (row, index, value) => {
  const start = index === 0 ? index : index - 1;
  const symbols = row.slice(start, index + value.length + 1);
  return symbols.some((symbol) => !symbol.match(symbolRegex));
};

const partOne = () => {
  // check that any symbol around is not a period (or a number) (or OOB)
  const results = twoDNumbers.map((rows) =>
    rows.filter(({ index, value, rowNum }) => {
      const rowAbove = twoDArray[rowNum - 1];
      // check row above
      if (rowAbove && checkFullRow(rowAbove, index, value)) {
        return true;
      }
      // check row below
      const rowBelow = twoDArray[rowNum + 1];
      if (rowBelow && checkFullRow(rowBelow, index, value)) {
        return true;
      }
      // check self row
      const rowSelf = twoDArray[rowNum];
      if (rowSelf) {
        const left = rowSelf[index - 1];
        const right = rowSelf[index + value.length];
        if (
          (left && !left.match(symbolRegex)) ||
          (right && !right.match(symbolRegex))
        ) {
          return true;
        }
      }

      return false;
    })
  );

  return results.reduce(
    (prev, curr) =>
      prev +
      curr.reduce((numPrev, numCurr) => numPrev + Number(numCurr.value), 0),
    0
  );
};


console.log(partOne())