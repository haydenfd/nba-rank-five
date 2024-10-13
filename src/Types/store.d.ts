interface PlayerDataInterface {
  _id: string;
  PLAYER_NAME: string;
  PLAYER_ID: string;
  FROM_YEAR?: number;
  PPG?: number;
  GP?: number;
  EXP?: number;
  TO_YEAR?: number;
  __v: number;
}


type AttemptsType = 0 | 1 | 2 | 3;

interface SnapshotInterface {
  players: PlayerDataInterface[];
  guesses: PlayerDataInterface[];
  attempts: AttemptsType;
}

export type { PlayerDataInterface, SnapshotInterface, AttemptsType };
