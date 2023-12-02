const input = require("./input.js");

// regex to find first number
// reverse the string
// regex to find second number

const regex = new RegExp(
  /([0-9]|(zero)|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine))+?/
);

const extractFirstNumber = (string) =>
  mapNumberWordToNumber(string.match(regex)[0]);

const mapNumberWordToNumber = (string) => {
  switch (string) {
    case "zero":
      return 0;
    case "one":
      return 1;
    case "two":
      return 2;
    case "three":
      return 3;
    case "four":
      return 4;
    case "five":
      return 5;
    case "six":
      return 6;
    case "seven":
      return 7;
    case "eight":
      return 8;
    case "nine":
      return 9;
    default:
      return Number(string);
  }
};

const solutionOne = () => {
  const output = input.split("\n").reduce((previous, current) => {
    return (
      previous +
      Number(
        `${extractFirstNumber(current)}${extractFirstNumber(
          current.split("").reverse().join("")
        )}`
      )
    );
  }, 0);

  console.log(output);
};

const tokenize = (string, result) => {
  if (string.length === 0) return [];
  else {
    const maybeNum = string.match(regex);
    if (maybeNum) {
      result.push(mapNumberWordToNumber(maybeNum[0]));
    }
    return tokenize(string.slice(1), result);
  }
};

const main = () => {
  const output = input.split("\n").reduce((previous, current) => {
    const results = [];
    tokenize(current, results);

    return previous + Number(`${results[0]}${results.pop()}`);
  }, 0);

  console.log(output)
};

main();
