const bigInput = require("./input");

const input0 = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const parseInput = (input) => {
  return input.split("\n\n").map((path) => {
    const rowsArray = path.split("\n");
    const rows = rowsArray.map((row) =>
      parseInt(row.replaceAll("#", "1").replaceAll(".", "0"), 2)
    );

    const columns = [];
    const rowWidth = rowsArray[0].split("").length;
    for (let i = 0; i < rowWidth; i++) {
      columns.push(
        parseInt(
          rowsArray.map((row) => (row[i] === "#" ? "1" : "0")).join(""),
          2
        )
      );
    }
    return {
      rows,
      columns,
    };
  });
};

// it might not be one-off it could be many indices off
const oldparseReflections = (reflections) => {
  if (reflections.length % 2 === 0) {
    // should be a perfect reflection
    return {
      isReflection: reflections.every(
        (elem, index) => elem === reflections[reflections.length - index - 1]
      ),
      toLeft: reflections.length / 2,
      reflections,
    };
  } else {
    const isLeftShift = reflections
      .slice(0, reflections.length - 1)
      .every(
        (elem, index) => elem === reflections[reflections.length - index - 1]
      );
    if (isLeftShift) {
      return {
        isReflection: isLeftShift,
        toLeft: Math.floor(reflections.length / 2),
        reflections,
      };
    } else {
      return {
        isReflection: reflections
          .slice(1, reflections.length)
          .every(
            (elem, index) =>
              elem === reflections[reflections.length - index - 1]
          ),
        toLeft: Math.ceil(reflections.length / 2),
        reflections,
      };
    }
  }
};

const parseReflections = (reflections) => {
  let response = { isReflection: false, toLeft: 0, reflections };
  for (let i = 0; i < reflections.length / 2; i++) {
    const leftArray = reflections.slice(0, i + 1).reverse();
    const rightArray = reflections.slice(i + 1);

    const shorterArray =
      leftArray.length > rightArray.length ? rightArray : leftArray;
    const longerArray =
      leftArray.length > rightArray.length ? leftArray : rightArray;
    const isReflection = shorterArray.every(
      (elem, index) => elem === longerArray[index]
    );
    if (isReflection) {
      response.isReflection = true;
      response.toLeft = leftArray.length;
    }
  }
  return response;
};

const getColumnReflections = (maps) =>
  maps
    .map(({ columns }) => columns)
    .map(parseReflections)
    .filter(({ isReflection }) => isReflection);

const getRowReflections = (maps) =>
  maps
    .map(({ rows }) => rows)
    .map(parseReflections)
    .filter(({ isReflection }) => isReflection);

const partOne = (input) => {
  const parsedMaps = parseInput(input);

  // console.log(parsedMaps)
  const reflectedCols = getColumnReflections(parsedMaps);
  const reflectedRows = getRowReflections(parsedMaps);

  // return (
  //   reflectedRows.reduce((prev, curr) => prev + curr.toLeft * 100, 0) +
  //   reflectedCols.reduce((prev, curr) => prev + curr.toLeft, 0)
  // );

  return [...reflectedRows, ...reflectedCols];
};

// console.log(partOne(input0));
console.log(partOne(bigInput));

// [
//   89, 24, 103,  66,
//   37, 37,  66, 103,
//   24
// ]
// [
//   109, 12, 30, 30,
//    76, 97, 30, 30,
//   115
// ]
// [
//   358, 90, 385,
//   385, 90, 102,
//   346
// ]
// [
//   281, 265, 103,
//   502, 502, 103,
//   265
// ]
