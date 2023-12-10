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

const input = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const input2 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

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

// console.log(partOne(input));
// console.log(partOne(input2));
console.log(partOne(bigInput));
