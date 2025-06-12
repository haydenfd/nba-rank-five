
type SessionStatusType = -1 | 0 | 1;
type AttemptsType = 0 | 1 | 2;

type PlayerDataInterface = any;

export interface CreateUserResponse {
    user_id: string;
  }
  
  export interface CreateSessionResponse {
    session_id: string;
    players: any[]; 
  }
  
  export interface FetchPlayersResponse {
    players: any[]; 
  }
  
interface CreateNewSessionResponseInterface {
  user_id: string;
  session_id: string;
  players: PlayerDataInterface[];
}

interface FetchSessionResponseInterface {
  user_id: string;
  session_id: string;
  session_status: SessionStatusType;
  attempts: AttemptsType;
  players: PlayerDataInterface[];
}

interface CreateNewUserResponseInterface {
  user_id: string;
  session_id: string;
  players: PlayerDataInterface[];
}

interface EvaluateSessionAttemptInterface {
  session_status: SessionStatusType;
  attempts: AttemptsType;
  scores: number[];
  solution?: PlayerDataInterface[];
}

export type { FetchSessionResponseInterface, CreateNewUserResponseInterface, CreateNewSessionResponseInterface, EvaluateSessionAttemptInterface };


interface PlayerType {
  PLAYER_ID: number;
  PLAYER_NAME: string;
  CODE: string;
  PPG?: number;
  APG?: number;
  RPG?: number;
  GP?: number;
}

type PlayerListType = PlayerType[];

export type {
  PlayerType,
  PlayerListType,
}