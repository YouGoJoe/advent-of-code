const bigInput = require("./input");
const input = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

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
    const direction = directions[stepCount % directions.length];
    currNode = mapping[currNode][direction];
    stepCount++;
  }

  return stepCount;
};

const traverseTwo = ({ directions, mapping }) =>
  Object.keys(mapping)
    .filter((node) => node.endsWith("A"))
    .map((node) => {
      let stepCount = 0;
      while (!node.endsWith("Z")) {
        const direction = directions[stepCount % directions.length];
        node = mapping[node][direction];
        stepCount++;
      }
      return stepCount;
    });

// console.log(traverseTwo(parseInput(input)));

// Like all great programmers, I stole this from SO
const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const lcmAll = (ns) => ns.reduce(lcm, 1);

console.log(lcmAll(traverseTwo(parseInput(bigInput))));
