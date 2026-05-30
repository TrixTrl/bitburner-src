export interface Puzzle {
  name: string;
  data: number[];
  readInput: (puzzle: Puzzle) => number;
  validateOutput: (puzzle: Puzzle, input: number) => boolean;
}
