const bigInput = require("./input");

const input0 = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const regex = new RegExp(/\?/g);
// console.log([...'.??..??...?##.'.matchAll(regex)])

const getMapping = (num) => {
  const upperBound = Math.pow(2, num);
  const maxSize = (upperBound - 1).toString(2).length; // trust
  let binaryNumbers = [];
  for (let i = 0; i < upperBound; i++) {
    // an array of numbers in binary
    binaryNumbers.push(i.toString(2).padStart(maxSize, "0"));
  }

  return binaryNumbers;
};

const applyMapping = (mapping, schema) =>
  mapping.map((mapper) => {
    const mapperArray = mapper.split("");
    const schemaArray = schema.split("");

    [...schema.matchAll(regex)].forEach((match, index) => {
      const symbol = mapperArray[index] === "1" ? "#" : ".";
      schemaArray.splice(match.index, 1, symbol);
    });

    return schemaArray.join("");
  });

const validator = (mapping, nums) =>
  mapping.filter(
    (candidate) =>
      candidate
        .split(".")
        .filter(Boolean)
        .map((element) => element.length)
        .join(",") === nums
  );

const parseRow = (row) => {
  const [schema, nums] = row.split(" ");
  const numQuestionMarks = schema
    .split("")
    .filter((value) => value === "?").length;

  const validated = validator(
    applyMapping(getMapping(numQuestionMarks), schema),
    nums
  );

  return validated;
};

const partOne = (input) => {
  const rows = input.split("\n");

  return rows.map((row) => parseRow(row).length);
};

// console.log(partOne(input0).reduce((prev, curr) => prev + curr, 0));
console.log(partOne(bigInput).reduce((prev, curr) => prev + curr, 0));
