const { countBy, isEqual } = require("lodash");
const input = require("./input");

const FIVEOAK = 7;
const FOUROAK = 6;
const FH = 5;
const THREEOAK = 4;
const TWOPAIR = 3;
const ONEPAIR = 2;
const HIGHCARD = 1;

const getType = (hand) => {
  const cards = hand.split("");
  const cardCounts = Object.values(countBy(cards)).sort().reverse();
  if (cardCounts.includes(5)) return FIVEOAK;
  if (cardCounts.includes(4)) return FOUROAK;
  if (isEqual(cardCounts, [3, 2])) return FH;
  if (isEqual(cardCounts, [3, 1, 1])) return THREEOAK;
  if (isEqual(cardCounts, [2, 2, 1])) return TWOPAIR;
  if (isEqual(cardCounts, [2, 1, 1, 1])) return ONEPAIR;

  return HIGHCARD;
};

const parsedInput = input.split("\n").map((row) => ({
  hand: row.split(" ")[0],
  bid: Number(row.split(" ")[1]),
  typePower: getType(row.split(" ")[0]),
}));

const handToValues = ({ hand }) =>
  hand.split("").map((card) => {
    if (Number(card)) {
      return Number(card);
    }
    // A, K, Q, J, T
    return { T: 10, J: 11, Q: 12, K: 13, A: 14 }[card];
  });

// -1 if first argument is less than second, 0 for tie, +1 for first greater than second
const compareHands = (hand0, hand1) => {
  const typePowerDiff = hand0.typePower - hand1.typePower;
  if (!typePowerDiff) {
    const numHand0 = handToValues(hand0);
    const numHand1 = handToValues(hand1);

    // iterate past ties
    let index = 0;
    while (numHand0[index] === numHand1[index]) {
      index++;
    }

    return numHand0[index] - numHand1[index];
  }
  return typePowerDiff;
};

console.log(
  parsedInput
    .sort(compareHands)
    .reduce((prev, curr, index) => prev + curr.bid * (index + 1), 0)
);
