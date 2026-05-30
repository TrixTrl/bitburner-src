import { Puzzle } from "./Puzzles";

export class Satellite {
  name: string = randomName();
  memory: number[] = getMemory();
  instructionPointer: number = 0;
  outputBuffer: number[] = [];
  inputBuffer: number[] = [];
  lockedOn: boolean = false;
  horizontalAngle: number = Math.random() * 360;
  verticalAngle: number = Math.random() * 90;
  signalStrength: number = (Math.random() + 0.5) * (Math.random() + 0.5) * 100;
  puzzle: Puzzle = getRandomPuzzle();
}

export function corruptMemory(sat: Satellite) {
  const randomMemoryValue = Math.floor(Math.random() * 255);
  sat.memory[randomMemoryValue] ^= 2 ** Math.floor(Math.random() * 8);
}

function randomName() {
  let name = "";
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (let i = 0; i < 20; i++) {
    name += letters[Math.floor(Math.random() * letters.length)];
  }
  return name;
}

function getMemory() {
  const memory = [];
  for (let i = 0; i < 256; i++) {
    memory.push(0);
  }
  return memory;
}

export function tick(sat: Satellite) {
  const opcode = (Math.floor(readFromAddress(sat, sat.instructionPointer)) >> 4) & 0xF;
  switch (opcode) {
    case 0x1: // MOV
      {
        incrememntPointer(sat);
        const addr0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = readFromAddress(sat, addr0);
        writeToAddress(sat, addr1, value0);
        break;
      }
    case 0x2: // LDI
      {
        incrememntPointer(sat);
        const value0 = readFromAddress(sat, sat.instructionPointer);
        incrememntPointer(sat);
        const addr0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        writeToAddress(sat, addr0, value0);
        break;
      }
    case 0x3: // ADD
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, value0 + value1);
        break;
      }
    case 0x4: // SUB
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, value0 - value1);
        break;
      }
    case 0x5: // MUL
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, value0 * value1);
        break;
      }
    case 0x6: // DIV
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, value0 / value1);
        break;
      }
    case 0x7: // AND
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, value0 & value1);
        break;
      }
    case 0x8: // OR
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, value0 | value1);
        break;
      }
    case 0x9: // XOR
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, value0 ^ value1);
        break;
      }
    case 0xA: // NAND
      {
        const addr0 = (Math.floor(readFromAddress(sat, sat.instructionPointer)) & 0xF) + 0xF0;
        incrememntPointer(sat);
        const addr1 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const addr2 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = sat.memory[addr1];
        const value1 = sat.memory[addr2];
        writeToAddress(sat, addr0, ~(value0 & value1));
        break;
      }
    case 0xB: // JMP
      {
        incrememntPointer(sat);
        incrememntPointer(sat);
        const value0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        sat.instructionPointer = value0;
        break;
      }
    case 0xC: // JEZ
      {
        incrememntPointer(sat);
        const addr0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value1 = readFromAddress(sat, addr0);
        if (value1 == 0) {
          sat.instructionPointer = value0;
        }
        break;
      }
    case 0xD: // JGZ
      {
        incrememntPointer(sat);
        const addr0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value1 = readFromAddress(sat, addr0);
        if (value1 > 0) {
          sat.instructionPointer = value0;
        }
        break;
      }
    case 0xE: // JLZ
      {
        incrememntPointer(sat);
        const addr0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value1 = readFromAddress(sat, addr0);
        if (value1 < 0) {
          sat.instructionPointer = value0;
        }
        break;
      }
    case 0xF: // JPM
      {
        incrememntPointer(sat);
        incrememntPointer(sat);
        const addr0 = Math.floor(readFromAddress(sat, sat.instructionPointer)) % 256;
        incrememntPointer(sat);
        const value0 = Math.floor(readFromAddress(sat, addr0)) % 256;
        sat.instructionPointer = value0;
        break;
      }
    default: // NOP
      sat.instructionPointer = (sat.instructionPointer + 3) % 256;
      break;
  }
}


function readFromAddress(sat: Satellite, address: number) {
  if (address == 255) {
    if (sat.inputBuffer.length == 0) {
      return 0;
    } else {
      return sat.inputBuffer.splice(0, 1)[0];
    }
  } else if (address == 254) {
    // Read from input
    return sat.puzzle.readInput(sat.puzzle);
  }
  return sat.memory[address];
}

function writeToAddress(sat: Satellite, address: number, value: number) {
  if (address == 255) {
    // Write to output
    sat.outputBuffer.push(value);
    if (sat.outputBuffer.length > 20) {
      sat.outputBuffer.splice(0, 1);
    }
  } else if (address == 254) {
    // Check puzzle solution
    if (sat.puzzle.validateOutput(sat.puzzle, value)) {
      // Give reward
    }
  } else {
    sat.memory[address] = value;
  }
}

function incrememntPointer(sat: Satellite) {
  sat.instructionPointer = (sat.instructionPointer + 1) % 256;
}

function getRandomPuzzle() {
  const puzzle: Puzzle = {
    name: "factorial",
    data: [Math.floor(Math.random() * 10)],
    readInput: (puzzle: Puzzle) => {
      puzzle.data = [Math.floor(Math.random() * 8) + 5];
      return puzzle.data[0];
    },
    validateOutput: (puzzle: Puzzle, input: number) => {
      function factorial(n: number): number {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
      }
      const correct = input == factorial(puzzle.data[0]);
      if (correct) {
        puzzle.data = [Math.floor(Math.random() * 8) + 5];
      }
      return correct;
    }

  };
  return puzzle;
}
