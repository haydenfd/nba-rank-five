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
  