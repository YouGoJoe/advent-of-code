const { sortBy } = require("lodash");
const bigInput = require("./input");

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const input = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const input2 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

const input3 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const input4 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

const extractStart = (twoDArray) => {
  const startRow = twoDArray.find(({ row }) =>
    row.some((elem) => elem === "S")
  );

  return {
    rowNum: startRow.index,
    index: startRow.row.findIndex((elem) => elem === "S"),
    elem: "S",
  };
};

class PipeTraversal {
  constructor(twoDArray, startingNode, next) {
    this.twoDArray = twoDArray;
    this.fullPath = [];
    this.currNode = startingNode;
    this.next = next;
  }

  travel() {
    let nextNode;
    if (this.next === "N") {
      const nextRow = this.twoDArray[this.currNode.rowNum - 1];
      const elem = nextRow ? nextRow.row[this.currNode.index] : undefined;
      const nextDirection = { "|": "N", F: "E", 7: "W" }[elem];
      nextNode = {
        rowNum: this.currNode.rowNum - 1,
        index: this.currNode.index,
        elem,
        next: nextDirection,
      };
    } else if (this.next === "E") {
      const nextRow = this.twoDArray[this.currNode.rowNum];
      const elem = nextRow.row[this.currNode.index + 1];
      const nextDirection = { "-": "E", J: "N", 7: "S" }[elem];
      nextNode = {
        rowNum: this.currNode.rowNum,
        index: this.currNode.index + 1,
        elem,
        next: nextDirection,
      };
    } else if (this.next === "S") {
      const nextRow = this.twoDArray[this.currNode.rowNum + 1];
      const elem = nextRow ? nextRow.row[this.currNode.index] : undefined;
      const nextDirection = { "|": "S", J: "W", L: "E" }[elem];
      nextNode = {
        rowNum: this.currNode.rowNum + 1,
        index: this.currNode.index,
        elem,
        next: nextDirection,
      };
    } else if (this.next === "W") {
      const nextRow = this.twoDArray[this.currNode.rowNum];
      const elem = nextRow.row[this.currNode.index - 1];
      const nextDirection = { "-": "W", F: "S", L: "N" }[elem];
      nextNode = {
        rowNum: this.currNode.rowNum,
        index: this.currNode.index - 1,
        elem,
        next: nextDirection,
      };
    }

    this.fullPath.push(nextNode);
    this.currNode = nextNode;
    this.next = nextNode.next;
  }

  generateFullPath() {
    this.travel();
    while (this.currNode.elem !== "S" && this.next) {
      this.travel();
    }
  }
}

const partOne = (input) => {
  const twoDArray = input
    .split("\n")
    .map((row, index) => ({ index, row: row.split("") }));

  const start = extractStart(twoDArray);

  // travel north
  const NorthTraversal = new PipeTraversal(twoDArray, start, "N");
  NorthTraversal.generateFullPath();
  // travel east
  const EastTraversal = new PipeTraversal(twoDArray, start, "E");
  EastTraversal.generateFullPath();
  // travel south
  const SouthTraversal = new PipeTraversal(twoDArray, start, "S");
  SouthTraversal.generateFullPath();
  // travel west
  const WestTraversal = new PipeTraversal(twoDArray, start, "W");
  WestTraversal.generateFullPath();
  // check for longest path, answer should be length/2

  return (
    sortBy([
      NorthTraversal.fullPath.length,
      EastTraversal.fullPath.length,
      SouthTraversal.fullPath.length,
      WestTraversal.fullPath.length,
    ])[3] / 2
  );
};

const connectNorth = ({ elem }) => elem === "|" || elem === "7" || elem === "F";
const connectSouth = ({ elem }) => elem === "|" || elem === "J" || elem === "L";
const connectEast = ({ elem }) => elem === "-" || elem === "L" || elem === "F";
const connectWest = ({ elem }) => elem === "-" || elem === "J" || elem === "7";

const partTwo = (input) => {
  const twoDArray = input
    .split("\n")
    .map((row, index) => ({ index, row: row.split("") }));

  const start = extractStart(twoDArray);

  // travel north
  const NorthTraversal = new PipeTraversal(twoDArray, start, "N");
  NorthTraversal.generateFullPath();
  // travel east
  const EastTraversal = new PipeTraversal(twoDArray, start, "E");
  EastTraversal.generateFullPath();
  // travel south
  const SouthTraversal = new PipeTraversal(twoDArray, start, "S");
  SouthTraversal.generateFullPath();
  // travel west
  const WestTraversal = new PipeTraversal(twoDArray, start, "W");
  WestTraversal.generateFullPath();

  const path = sortBy(
    [NorthTraversal, EastTraversal, SouthTraversal, WestTraversal],
    (traversal) => traversal.fullPath.length
  )[3];

  const scrubbedArray = twoDArray.map(({ row }, rowIndex) =>
    row.map((_, elemIndex) => {
      const foundElem = path.fullPath.find(
        (pathRow) => pathRow.rowNum === rowIndex && pathRow.index === elemIndex
      );

      // swap S for its correct piece
      if (foundElem?.elem === "S") {
        const northElem =
          path.fullPath.find(
            (pathRow) =>
              pathRow.rowNum === rowIndex - 1 && pathRow.index === elemIndex
          ) ?? {};
        const southElem =
          path.fullPath.find(
            (pathRow) =>
              pathRow.rowNum === rowIndex + 1 && pathRow.index === elemIndex
          ) ?? {};
        const eastElem =
          path.fullPath.find(
            (pathRow) =>
              pathRow.rowNum === rowIndex && pathRow.index === elemIndex + 1
          ) ?? {};
        const westElem =
          path.fullPath.find(
            (pathRow) =>
              pathRow.rowNum === rowIndex && pathRow.index === elemIndex - 1
          ) ?? {};

        if (connectNorth(southElem) && connectSouth(northElem)) return "|";
        else if (connectEast(westElem) && connectWest(eastElem)) return "-";
        else if (connectSouth(northElem) && connectWest(eastElem)) return "L";
        else if (connectSouth(northElem) && connectEast(westElem)) return "J";
        else if (connectNorth(southElem) && connectWest(eastElem)) return "F";
        else if (connectNorth(southElem) && connectEast(westElem)) return "7";
      }

      return foundElem?.elem ?? ".";
    })
  );

  // North = 0, South = 4, NW = 7
  const insideOutside = [];
  scrubbedArray.forEach((scrubbedRow, rowIndex) => {
    let insideOutsideRow = [];
    scrubbedRow.forEach((elem, elemIndex) => {
      if (rowIndex === 0) {
        if (elem === ".") {
          insideOutsideRow.push({
            elem: "O",
            inside: [],
          });
        } else if (elem === "F") {
          insideOutsideRow.push({
            elem: "F",
            inside: [3],
          });
        } else if (elem === "-") {
          insideOutsideRow.push({
            elem: "-",
            inside: [3, 4, 5],
          });
        } else if (elem === "7") {
          insideOutsideRow.push({
            elem: "7",
            inside: [5],
          });
        }
      } else {
        if (elem === "|") {
          const westElem = insideOutsideRow[elemIndex - 1];
          if (!westElem) {
            insideOutsideRow.push({
              elem: "|",
              inside: [1, 2, 3],
            });
          } else {
            const leftInside = westElem.inside.includes(2);
            insideOutsideRow.push({
              elem: "|",
              inside: leftInside ? [5, 6, 7] : [1, 2, 3],
            });
          }
        } else if (elem === "-") {
          const northElem = insideOutside[rowIndex - 1][elemIndex];
          const isInside = northElem.inside.includes(4);
          insideOutsideRow.push({
            elem: "-",
            inside: isInside ? [0, 1, 7] : [3, 4, 5],
          });
        } else if (elem === "L") {
          const westElem = insideOutsideRow[elemIndex - 1];
          if (!westElem) {
            insideOutsideRow.push({
              elem: "L",
              inside: [1],
            });
          } else {
            const isInside = westElem.inside.includes(2);
            insideOutsideRow.push({
              elem: "L",
              inside: isInside ? [3, 4, 5, 6, 7] : [1],
            });
          }
        } else if (elem === "F") {
          const westElem = insideOutsideRow[elemIndex - 1];
          if (!westElem) {
            insideOutsideRow.push({
              elem: "F",
              inside: [3],
            });
          } else {
            const isInside = westElem.inside.includes(2);
            insideOutsideRow.push({
              elem: "F",
              inside: isInside ? [0, 1, 5, 6, 7] : [3],
            });
          }
        } else if (elem === "J") {
          const westElem = insideOutsideRow[elemIndex - 1];
          const topLeftIsInside = westElem.inside.includes(1);
          insideOutsideRow.push({
            elem: "J",
            inside: topLeftIsInside ? [7] : [1, 2, 3, 4, 5],
          });
        } else if (elem === "7") {
          const westElem = insideOutsideRow[elemIndex - 1];
          const bottomLeftIsInside = westElem.inside.includes(3);
          insideOutsideRow.push({
            elem: "7",
            inside: bottomLeftIsInside ? [5] : [0, 1, 2, 3, 7],
          });
        } else if (elem === ".") {
          const westElem = insideOutsideRow[elemIndex - 1];
          if (!westElem) {
            insideOutsideRow.push({
              elem: "O",
              inside: [],
            });
          } else {
            const leftIsInside = westElem.inside.includes(2);
            insideOutsideRow.push({
              elem: leftIsInside ? "I" : "O",
              inside: leftIsInside ? [0, 1, 2, 3, 4, 5, 6, 7] : [],
            });
          }
        }
      }
    });
    insideOutside.push(insideOutsideRow);
  });

  return insideOutside.reduce(
    (prev, row) =>
      prev +
      row.reduce((prev, { elem }) => {
        if (elem == "I") {
          return prev + 1;
        }
        return prev;
      }, 0),
    0
  );
};

console.log(partTwo(bigInput));
