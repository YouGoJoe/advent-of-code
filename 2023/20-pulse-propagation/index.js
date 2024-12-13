const input = require("./input");

const sampleInput = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

const sampleInput2 = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const BROADCASTER = "broadcaster";
const FLIP_FLOP = "flip-flop";
const CONJUNCTION = "conjunction";
const HIGH = "high";
const LOW = "low";
let GLOBAL_CONFIG = {};
let GLOBAL_LOW_COUNTER = 0;
let GLOBAL_HIGH_COUNTER = 0;
let HIT_RX = false;

const parseInput = (input) => {
  return input.split("\n").reduce((prev, row) => {
    const [module, dest] = row.split(" -> ");
    let attrs = {};
    let moduleName;
    if (module === BROADCASTER) {
      attrs.type = BROADCASTER;
      moduleName = BROADCASTER;
    } else if (module.startsWith("%")) {
      attrs.type = FLIP_FLOP;
      moduleName = module.slice(1);
      attrs.isOff = true;
    } else if (module.startsWith("&")) {
      attrs.type = CONJUNCTION;
      moduleName = module.slice(1);
      attrs.memory = {};
    }

    return {
      ...prev,
      [moduleName]: { ...attrs, dest: dest.split(", "), inputs: [] },
    };
  }, {});
};

const populateConjunctionMemory = () => {
  Object.keys(GLOBAL_CONFIG).forEach((keyName) => {
    const module = GLOBAL_CONFIG[keyName];
    module.dest.forEach((destModuleName) => {
      const destModule = GLOBAL_CONFIG[destModuleName];
      if (destModule) {
        if (destModule.type === CONJUNCTION) {
          // they initially default to remembering a low pulse for each input
          destModule.memory[keyName] = LOW;
        }
      }
    });
  });
};

const processSignal = ({ input, destinations, signal }) => {
  const newSteps = [];
  destinations.forEach((dest) => {
    const module = GLOBAL_CONFIG[dest];

    if (dest === "rx" && signal === LOW) {
      console.log({ input, destinations, signal });
      HIT_RX = true;
    }
    if (!module) return;

    if (module.type === BROADCASTER) {
      newSteps.push({
        input: dest,
        destinations: module.dest,
        signal,
      });
    } else if (module.type === FLIP_FLOP) {
      if (signal === LOW) {
        if (module.isOff) {
          // If it was off, it turns on and sends a high pulse
          module.isOff = false;
          newSteps.push({
            input: dest,
            destinations: module.dest,
            signal: HIGH,
          });
        } else {
          // If it was on, it turns off and sends a low pulse.
          module.isOff = true;
          newSteps.push({
            input: dest,
            destinations: module.dest,
            signal: LOW,
          });
        }
      }
    } else if (module.type == CONJUNCTION) {
      // the conjunction module first updates its memory for that input
      module.memory[input] = signal;
      if (Object.values(module.memory).every((pulse) => pulse === HIGH)) {
        // if it remembers high pulses for all inputs, it sends a low pulse
        newSteps.push({
          input: dest,
          destinations: module.dest,
          signal: LOW,
        });
      } else {
        // otherwise, it sends a high pulse
        newSteps.push({
          input: dest,
          destinations: module.dest,
          signal: HIGH,
        });
      }
    }
  });

  return newSteps;
};

const pushButton = () => {
  let steps = [{ input: "button", destinations: [BROADCASTER], signal: LOW }];
  do {
    updateCounters(steps);
    steps = steps.reduce((prev, step) => {
      const newSteps = processSignal(step);

      return [...prev, ...newSteps];
    }, []);
  } while (steps.length);
};

const updateCounters = (steps) => {
  steps.forEach((step) => {
    if (step.signal === LOW) {
      GLOBAL_LOW_COUNTER += step.destinations.length;
    } else {
      GLOBAL_HIGH_COUNTER += step.destinations.length;
    }
  });
};
const printCounters = () => {
  console.log(GLOBAL_LOW_COUNTER);
  console.log(GLOBAL_HIGH_COUNTER);
};

const partOne = (input) => {
  GLOBAL_CONFIG = parseInput(input);
  populateConjunctionMemory();
  for (let i = 0; i < 1000; i++) {
    pushButton();
  }
  printCounters();
  console.log(GLOBAL_LOW_COUNTER * GLOBAL_HIGH_COUNTER);
};

const partTwo = (input) => {
  GLOBAL_CONFIG = parseInput(input);
  populateConjunctionMemory();
  let numPresses = 0;

  // okay instead of brute forcing I think I should be able to calculate each step and then multiple together
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    pushButton();
    numPresses++;
    if (HIT_RX === true) {
      console.log(numPresses);
      break;
    }
  }
  printCounters();
};

// partOne(sampleInput);
// partOne(sampleInput2);
partTwo(input);
