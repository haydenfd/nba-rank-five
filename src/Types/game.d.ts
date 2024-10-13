import { PlayerDataInterface } from "./store";

interface GuessCrumbsPropsInterface {
  guesses: PlayerDataInterface[];
  scores: number[];
  isVisible?: boolean;
}

type SessionStatusType = -1 | 0 | 1;

export { GuessCrumbsPropsInterface, SessionStatusType };
