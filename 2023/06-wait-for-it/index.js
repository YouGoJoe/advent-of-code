// demo
// Time:      7  15   30
// Distance:  9  40  200

// real
// Time:        46     82     84     79
// Distance:   347   1522   1406   1471

const races = [
  {
    time: 46828479,
    record: 347152214061471,
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
