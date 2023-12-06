// demo
// Time:      7  15   30
// Distance:  9  40  200

// real
// Time:        46     82     84     79
// Distance:   347   1522   1406   1471

const races = [
  {
    time: 46,
    record: 347,
  },
  {
    time: 82,
    record: 1522,
  },
  {
    time: 84,
    record: 1406,
  },
  {
    time: 79,
    record: 1471,
  },
];

const checkRace = (race) => {
  let result = 0;
  for (let i = 0; i < race.time; i++) {
    if (i * (race.time - i) > race.record) result++;
  }
  return result;
};

const result = races.reduce((prev, race) => prev * checkRace(race), 1);

console.log(result);
