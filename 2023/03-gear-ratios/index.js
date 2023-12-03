const input = require("./input.js");

// const input = `467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ....755...
// ...$.*....
// .664.598..`
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

// part two

const maybeGears = input.split("\n").map((row, rowNum) =>
  [...row.matchAll(/\*/g)].map((result) => ({
    index: result.index,
    value: result[0],
    rowNum,
  }))
);

const allNumbers = twoDNumbers.reduce((prev, curr) => [...prev, ...curr], []);
const numbersRegex = new RegExp(/([0-9])/);

const allGearRows = maybeGears.map((gearRow) => {
  if (!gearRow.length) return [];

  return gearRow.map(({ index, rowNum }) => {
    const gearNums = [];
    // check row above for numbers
    if (twoDArray[rowNum - 1]) {
      const northnum = allNumbers.find(
        (number) => number.rowNum === rowNum - 1 && number.index === index
      );
      if (northnum) {
        gearNums.push(northnum.value);
      }
      const nenum = allNumbers.find(
        (number) => number.rowNum === rowNum - 1 && number.index === index + 1
      );
      if (nenum) {
        gearNums.push(nenum.value);
      }

      // northwest - annoying. might be in the middle of a num
      if (twoDArray[rowNum - 1][index - 1].match(numbersRegex)) {
        let idxCheck = index - 1;
        let found;
        do {
          found = allNumbers.find(
            (number) =>
              number.rowNum === rowNum - 1 && number.index === idxCheck
          );
          idxCheck--;
        } while (!found);
        gearNums.push(found.value);
      }
    }
    // check row below for numbers
    if (twoDArray[rowNum + 1]) {
      const southnum = allNumbers.find(
        (number) => number.rowNum === rowNum + 1 && number.index === index
      );
      if (southnum) {
        gearNums.push(southnum.value);
      }
      const senum = allNumbers.find(
        (number) => number.rowNum === rowNum + 1 && number.index === index + 1
      );
      if (senum) {
        gearNums.push(senum.value);
      }
      // southwest - annoying. might be in the middle of a num
      if (twoDArray[rowNum + 1][index - 1].match(numbersRegex)) {
        let idxCheck = index - 1;
        let found;
        do {
          found = allNumbers.find(
            (number) =>
              number.rowNum === rowNum + 1 && number.index === idxCheck
          );
          idxCheck--;
        } while (!found);
        gearNums.push(found.value);
      }
    }
    // check left and right for numbers
    const west = twoDArray[rowNum][index - 1];
    const east = twoDArray[rowNum][index + 1];
    if (west.match(numbersRegex)) {
      gearNums.push(
        allNumbers.find(
          (number) =>
            number.rowNum === rowNum &&
            number.index === index - number.value.length
        ).value
      );
    }
    if (east.match(numbersRegex)) {
      gearNums.push(
        allNumbers.find(
          (number) => number.rowNum === rowNum && number.index === index + 1
        ).value
      );
    }

    return gearNums;
  });
});

const result = allGearRows.reduce((prev, curr) => {
  if (!curr.length) return prev;

  const rowTotal = curr.reduce((rowPrev, rowCurr) => {
    if (rowCurr.length !== 2) return rowPrev;

    return rowPrev + Number(rowCurr[0]) * Number(rowCurr[1]);
  }, 0);

  return prev + rowTotal;
}, 0);

console.log(result);
