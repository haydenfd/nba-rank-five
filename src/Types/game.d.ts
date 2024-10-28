import { PlayerDataInterface } from "./store";

interface GuessCrumbsPropsInterface {
  guesses: PlayerDataInterface[];
  scores: number[];
  isVisible?: boolean;
}

type SessionStatusType = -1 | 0 | 1;

/* Begin - Game/Card.tsx types */

interface CardPropsInterface {
  id: string;
  name: string;
  ppg: string;
  code?: string;
  color?: string;
}

/* End - Game/Card.tsx types */

export { GuessCrumbsPropsInterface, SessionStatusType, CardPropsInterface };
