const input = require("./input.js");

const cards = input.split("\n");

const parseCard = (card, index) => {
  const [winNums, haveNums] = card.split(":")[1].trim().split("|");
  return {
    cardNum: index + 1,
    quantity: 1,
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

const getWins = ({ winNums, haveNums }) => {
  let wins = 0;
  haveNums.forEach((haveNum) => {
    if (winNums.includes(haveNum)) wins++;
  });

  return wins;
};

const partOne = () =>
  cards.map(parseCard).reduce((prev, curr) => prev + getPoints(curr), 0);

const partTwo = () => {
  const parsedCards = cards
    .map(parseCard)
    .map((parsedCard, index, allCards) => {
      const wins = getWins(parsedCard);
      for (let i = 0; i < wins; i++) {
        allCards[index + i + 1].quantity += 1 * parsedCard.quantity;
      }

      return parsedCard;
    });

  return parsedCards.reduce((prev, curr) => prev + curr.quantity, 0);
};
