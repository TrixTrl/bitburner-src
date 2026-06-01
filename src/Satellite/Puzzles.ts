export type Puzzle = {
  name: string;
  data: number[];
  /*readInput: (puzzle: Puzzle) => number;
  validateOutput: (puzzle: Puzzle, input: number) => boolean;*/
}

export function readInput(puzzle: Puzzle) {
  switch (puzzle.name) {
    case "factorial":
      {
        puzzle.data = [Math.floor(Math.random() * 8) + 5];
        return puzzle.data[0];
        break;
      }
    default:
      {
        throw new Error(`Invalid satellite puzzle type: ${puzzle.name}`);
      }
  }
}

export function validateOutput(puzzle: Puzzle, input: number) {
  switch (puzzle.name) {
    case "factorial":
      {
        const correct = input == factorial(puzzle.data[0]);
        if (correct) {
          puzzle.data = [Math.floor(Math.random() * 8) + 5];
        }
        return correct;
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
