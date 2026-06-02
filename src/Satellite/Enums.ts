import { _ValueOf } from "@nsdefs";

export const PuzzleTypes = {
  factorial: "factor!al",
  echo: "echo-o-o",
  listSort: "asscending",
} as const ;

export type puzzleType = _ValueOf<typeof PuzzleTypes>;
