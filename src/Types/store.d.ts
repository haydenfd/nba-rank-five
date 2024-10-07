interface PlayerDataInterface {
  _id: string;
  PLAYER_NAME: string;
  PLAYER_ID: string;
  FROM_YEAR: number;
  PPG: number;
  GP: number;
  EXP: number;
  TO_YEAR: number;
  __v: number;
}

interface SolutionMapInterface {
  [key: string]: number;
}


type AttemptsType = 0 | 1 | 2 | 3;

interface SnapshotInterface {
  players: PlayerDataInterface[];
  guesses: PlayerDataInterface[];
  solution_map: SolutionMapInterface;
  attempts: AttemptsType;
}

export type {
  PlayerDataInterface,
  SnapshotInterface,
  SolutionMapInterface,
  AttemptsType,
};
