const { sortBy, chunk, flatten } = require("lodash");
const input = require("./input");

const [seedString, ...mappersStrings] = input.split("\n\n");

const parseInitialSeeds = (string) =>
  string.split(": ")[1].split(" ").map(Number);

const parseMapping = (string) =>
  string
    .split(":")[1]
    .split("\n")
    .slice(1)
    .map((row) => {
      const [destStart, sourceStart, length] = row.split(" ").map(Number);
      return { destStart, sourceStart, length };
    });

const mappers = mappersStrings.map(parseMapping);

const mapPipe = (source, mapper) => {
  const foundMapping = mapper.find(
    (mapping) =>
      source >= mapping.sourceStart &&
      source < mapping.sourceStart + mapping.length
  );
  if (foundMapping) {
    // translate source to dest
    return foundMapping.destStart - foundMapping.sourceStart + source;
  }
  return source;
};

const partOne = () => {
  const result = parseInitialSeeds(seedString).map((seed) =>
    mappers.reduce((prev, curr) => mapPipe(prev, curr), seed)
  );

  console.log(sortBy(result));
};

// Heap error
const partTwo = () => {
  // turn into pairs of seeds of [start, length] and produce all seeds
  const seeds = chunk(seedString.split(": ")[1].split(" ").map(Number), 2).map(
    ([start, length]) =>
      new Array(length).fill().map((_, index) => start + index)
  );

  const result = seeds[0].map((seed) =>
    mappers.reduce((prev, curr) => mapPipe(prev, curr), seed)
  );

  console.log(sortBy(result)[0]);
};

partTwo();

