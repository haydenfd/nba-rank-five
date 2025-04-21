interface PlayerDataInterface {
  _id: string;
  PLAYER_NAME: string;
  PLAYER_ID: string;
  FROM_YEAR?: number;
  PPG?: number;
  GP?: number;
  EXP?: number;
  TO_YEAR?: number;
  ROSTERSTATUS?: number;
  START_YEAR?: number;
  END_YEAR?: number;
  SEASONS_EXPOSED? : number;
  SEASONS_PLAYED? : number;
  GS?: number; 
  APG?: number;
  RPG?: number;
  MPG?: number;
  GAMES_PER_SEASON?: number;
  CODE?: string;
}

type AttemptsType = 0 | 1 | 2 | 3;

interface SnapshotInterface {
  players: PlayerDataInterface[];
  guesses: PlayerDataInterface[];
  attempts: AttemptsType;
}

export type { PlayerDataInterface, SnapshotInterface, AttemptsType };
