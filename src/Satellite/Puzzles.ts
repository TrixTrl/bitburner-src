import { puzzleType, PuzzleTypes } from "./Enums";

export type Puzzle = {
  name: puzzleType;
  data: number[];
  remainingData: number;
  remainingOutput: number;
}

export function updatePuzzleData(puzzle: Puzzle, reading: boolean) {
  if ((reading && puzzle.remainingData <= 0) || puzzle.remainingOutput <= 0) {
    switch (puzzle.name) {
      case PuzzleTypes.factorial:
        {
          puzzle.data = [Math.floor(Math.random() * 8) + 5];
          puzzle.remainingData = 1;
          puzzle.remainingOutput = 1;
          break;
        }
      case PuzzleTypes.echo:
        {
          puzzle.data = [Math.floor(Math.random() * 100)];
          puzzle.remainingData = 1;
          puzzle.remainingOutput = 1;
          break;
        }
      case PuzzleTypes.listSort:
        {
          const listLength = Math.floor(Math.random() * 5) + 3;
          puzzle.data = [];
          for (let i = 0; i < listLength; i++) {
            puzzle.data.push(Math.floor(Math.random() * 20));
          }
          puzzle.data.push(0);
          puzzle.remainingData = listLength + 1;
          puzzle.remainingOutput = listLength;
          break;
        }
      default:
        {
          throw new Error(`Invalid satellite puzzle type: ${puzzle.name}`);
        }
    }
  }
}

export function readInput(puzzle: Puzzle) {
  if (puzzle.remainingData <= 0) {
    throw new Error('Trying to read satellite puzzle data although it should have been reset, this is a bug, bug me (Hallowed / @TrixTrl) about it');
  }
  switch (puzzle.name) {
    case PuzzleTypes.factorial:
      {
        const index = puzzle.data.length - puzzle.remainingData;
        puzzle.remainingData--;
        return puzzle.data[index];
      }
    case PuzzleTypes.echo:
      {
        const index = puzzle.data.length - puzzle.remainingData;
        puzzle.remainingData--;
        return puzzle.data[index];
      }
    case PuzzleTypes.listSort: {
      const index = puzzle.data.length - puzzle.remainingData;
      puzzle.remainingData--;
      return puzzle.data[index];
    }
    default:
      {
        throw new Error(`Invalid satellite puzzle type: ${puzzle.name}`);
      }
  }
}

export function validateOutput(puzzle: Puzzle, input: number) {
  switch (puzzle.name) {
    case PuzzleTypes.factorial:
      {
        const correct = input == factorial(puzzle.data[0]);
        if (correct) {
          puzzle.remainingOutput--;
        } else {
          puzzle.remainingOutput = -1;
        }
        return puzzle.remainingData == 0;
      }
    case PuzzleTypes.echo:
      {
        const correct = input == puzzle.data[0];
        if (correct) {
          puzzle.remainingOutput--;
        } else {
          puzzle.remainingOutput = -1;

        }
        return puzzle.remainingData == 0;
      }
    case PuzzleTypes.listSort:
      {

        const listToBeSorted = puzzle.data.slice(0, -1);
        listToBeSorted.sort();
        const index = puzzle.data.length - 1 - puzzle.remainingOutput;
        const correct = input == listToBeSorted[index];
        if (correct) {
          puzzle.remainingOutput--;
        } else {
          puzzle.remainingOutput = -1;
        }
        return puzzle.remainingData == 0;
      }
    default:
      {
        throw new Error(`Invalid satellite puzzle type: ${puzzle.name}`);
      }
  }
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
