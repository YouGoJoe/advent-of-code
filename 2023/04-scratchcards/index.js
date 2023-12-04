const input = require("./input.js");

const cards = input.split("\n");

const parseCard = (card) => {
  const [winNums, haveNums] = card.split(":")[1].trim().split("|");
  return {
    winNums: winNums.split(" ").filter(Boolean).map(Number),
    haveNums: haveNums.split(" ").filter(Boolean).map(Number),
  };
};

const getPoints = ({ winNums, haveNums }) => {
  let score = 0.5;
  haveNums.forEach((haveNum) => {
    if (winNums.includes(haveNum)) score = score * 2;
  });

  return score === 0.5 ? 0 : score;
};

const result = cards
  .map(parseCard)
  .reduce((prev, curr) => prev + getPoints(curr), 0);

console.log(result);
