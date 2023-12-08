const bigInput = require("./input");
const input = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const parseInput = (input) => {
  const [directions, , ...mapping] = input.split("\n");
  return {
    directions: directions.split(""),
    mapping: mapping.reduce(
      (prev, row) => ({
        ...prev,
        [row.substring(0, 3)]: {
          L: row.substring(7, 10),
          R: row.substring(12, 15),
        },
      }),
      {}
    ),
  };
};

const traverse = ({ directions, mapping }) => {
  let stepCount = 0;
  let currNode = "AAA";
  while (currNode != "ZZZ") {
    const direction = directions[stepCount % directions.length]
    currNode = mapping[currNode][direction]
    stepCount++
  }

  return stepCount
};

// console.log(traverse(parseInput(input)));
console.log(traverse(parseInput(bigInput)));
