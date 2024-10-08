import { PlayerDataInterface, SolutionMapInterface } from "./store";

interface GuessCrumbsInterface {
  solution_map: SolutionMapInterface;
  guesses: PlayerDataInterface[];
  isVisible?: boolean;
}

type SessionStatusType = -1 | 0 | 1;

export { GuessCrumbsInterface, SessionStatusType };
