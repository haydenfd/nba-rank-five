import { SessionStatusType } from "./game";
import { AttemptsType, PlayerDataInterface } from "./store";

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

export { FetchSessionResponseInterface, CreateNewUserResponseInterface, CreateNewSessionResponseInterface, EvaluateSessionAttemptInterface};
