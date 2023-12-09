const bigInput = require("./input");

const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const parseInput = (input) =>
  input.split("\n").map((row) => row.split(" ").map(Number));

const diffSteps = (steps) => {
  const prevRow = steps[steps.length - 1];
  if (prevRow.every((val) => val === 0)) {
    // push the extra 0 to help with the summation step
    prevRow.unshift(0);
    return steps;
  }
  const nextRow = [];
  for (let i = 0; i < prevRow.length - 1; i++) {
    nextRow.push(prevRow[i + 1] - prevRow[i]);
  }
  steps.push(nextRow);
  return diffSteps(steps);
};

const incrementSteps = (diffedSteps) => {
  for (let i = 0; i < diffedSteps.length - 1; i++) {
    const prevRow = diffedSteps[i];
    const workingRow = diffedSteps[i + 1];
    workingRow.push(
      prevRow[prevRow.length - 1] + workingRow[workingRow.length - 1]
    );
  }
  return diffedSteps;
};

const decrementSteps = (diffedSteps) => {
  for (let i = 0; i < diffedSteps.length - 1; i++) {
    const prevRow = diffedSteps[i];
    const workingRow = diffedSteps[i + 1];
    workingRow.unshift(workingRow[0] - prevRow[0]);
  }
  return diffedSteps;
};

const partOne = (input) =>
  parseInput(input)
    .map((row) => incrementSteps(diffSteps([row]).reverse()))
    .reduce((prev, curr) => prev + curr.pop().pop(), 0);

const partTwo = (input) =>
  parseInput(input)
    .map((row) => decrementSteps(diffSteps([row]).reverse()))
    .reduce((prev, curr) => prev + curr.pop()[0], 0);

// console.log(partTwo(input));
console.log(partTwo(bigInput));

