const input = require("./input.js");

// failure: 12 red cubes, 13 green cubes, and 14 blue cubes
const FAILURE = { red: 12, green: 13, blue: 14 };

const parseRound = (roundString) => {
  const cubes = roundString.trim().split(",");

  return cubes.reduce((prev, curr) => {
    const [count, colour] = curr.trim().split(" ");
    return { ...prev, [colour]: Number(count) };
  }, {});
};

// break up games into rounds
const parseGame = (gameString) => {
  const [gameText, roundsText] = gameString.split(":");

  return {
    id: Number(gameText.substring(5)),
    rounds: roundsText.split(";").map(parseRound),
  };
};

const checkGame = (game) => {
  // check failure condition for each round
  if (
    game.rounds.some((round) => {
      const redFail = round.red > FAILURE.red;
      const greenFail = round.green > FAILURE.green;
      const blueFail = round.blue > FAILURE.blue;
      return redFail || greenFail || blueFail;
    })
  ) {
    // return 0 "points" if any rounds are impossible
    return 0;
  }
  return game.id;
};

// break up input into games
const games = input.split("\n");
const result = games.reduce(
  (prev, game) => prev + checkGame(parseGame(game)),
  0
);

console.log(result)
