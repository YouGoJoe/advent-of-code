const { flatten } = require("lodash");
const bigInput = require("./input");

const input0 = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

const expandUniverse = (universe) => {
  // columnar expansion
  const columnsToExpand = [];
  for (let i = 0; i < universe[0].length; i++) {
    if (universe.every((row) => row[i] === ".")) {
      columnsToExpand.push(i);
    }
  }

  const expandedUniverse = universe.map((row) => {
    columnsToExpand.map((value, index) => row.splice(value + index, 0, "."));
    return row;
  });

  // row expansion
  const rowsToExpand = [];
  expandedUniverse.forEach((row, index) => {
    if (row.every((elem) => elem === ".")) {
      rowsToExpand.push(index);
    }
  });

  // how's that for a variable name
  const widthOfUniverse = expandedUniverse[0].length;
  rowsToExpand.forEach((rowNum, index) => {
    expandedUniverse.splice(
      rowNum + index,
      0,
      Array(widthOfUniverse).fill(".")
    );
  });

  return expandedUniverse;
};
const getGalaxies = (universe) =>
  flatten(
    universe.map((row, rowNum) =>
      [...row.join("").matchAll(/\#/g)].map((result) => ({
        index: result.index,
        rowNum,
      }))
    )
  );

const diffGalaxies = (galaxyA, galaxyB) =>
  Math.abs(galaxyA.index - galaxyB.index) +
  Math.abs(galaxyA.rowNum - galaxyB.rowNum);

const partOne = (input) => {
  const twoDArray = input.split("\n").map((row) => row.split(""));
  const universe = expandUniverse(twoDArray);
  const galaxies = getGalaxies(universe);

  const galaxyDiffs = [];
  galaxies.forEach((galaxyA, index) => {
    for (let i = index + 1; i < galaxies.length; i++) {
      galaxyDiffs.push(diffGalaxies(galaxyA, galaxies[i]));
    }
  });

  return galaxyDiffs.reduce((prev, curr) => prev + curr, 0);
};

const getExpansionPoints = (universe) => {
  // columnar expansion
  const columnsToExpand = [];
  for (let i = 0; i < universe[0].length; i++) {
    if (universe.every((row) => row[i] === ".")) {
      columnsToExpand.push(i);
    }
  }

  // row expansion
  const rowsToExpand = [];
  universe.forEach((row, index) => {
    if (row.every((elem) => elem === ".")) {
      rowsToExpand.push(index);
    }
  });

  return {
    rowsToExpand,
    columnsToExpand,
  };
};

const partTwo = (input) => {
  const twoDArray = input.split("\n").map((row) => row.split(""));
  const { columnsToExpand, rowsToExpand } = getExpansionPoints(twoDArray);
  const galaxies = getGalaxies(twoDArray);

  // Off-by-one errors
  let expansionCoefficient = 1000000 - 1;
  const galaxyDiffs = [];
  galaxies.forEach((galaxyA, index) => {
    for (let i = index + 1; i < galaxies.length; i++) {
      const galaxyB = galaxies[i];
      const rowExpansion = rowsToExpand.filter(
        (rowNum) =>
          (galaxyA.rowNum < rowNum && rowNum < galaxyB.rowNum) ||
          (galaxyB.rowNum < rowNum && rowNum < galaxyA.rowNum)
      );

      const colExpansion = columnsToExpand.filter(
        (colNum) =>
          (galaxyA.index < colNum && colNum < galaxyB.index) ||
          (galaxyB.index < colNum && colNum < galaxyA.index)
      );

      const colExp = colExpansion.length * expansionCoefficient;
      const rowExp = rowExpansion.length * expansionCoefficient;
      const diff =
        Math.abs(galaxyB.index - galaxyA.index) +
        Math.abs(galaxyB.rowNum - galaxyA.rowNum) +
        colExp +
        rowExp;

      galaxyDiffs.push(diff);
    }
  });

  return galaxyDiffs.reduce((prev, curr) => prev + curr, 0);
};

console.log(partTwo(input0));
