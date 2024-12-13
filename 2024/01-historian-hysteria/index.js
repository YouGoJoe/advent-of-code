const { sortBy } = require("lodash");

const input = require("./input");

// const input = `3   4
// 4   3
// 2   5
// 1   3
// 3   9
// 3   3`;

const out = input
  .split("\n")
  .map((line) => line.split("   "))
  .reduce(
    (prev, curr) => {
      return {
        lefts: [...prev.lefts, Number(curr[0])],
        rights: [...prev.rights, Number(curr[1])],
      };
    },
    { rights: [], lefts: [] }
  );

const sortedRights = sortBy(out.rights);
const sortedLefts = sortBy(out.lefts);

const numOut = sortedLefts.reduce((prev, curr, currIndex) => {
  return prev + Math.abs(curr - sortedRights[currIndex]);
}, 0);

const similarityScore = sortedLefts.reduce((prev, curr) => {
  return prev + curr * sortedRights.filter((val) => val === curr).length;
}, 0);

console.log(similarityScore)
