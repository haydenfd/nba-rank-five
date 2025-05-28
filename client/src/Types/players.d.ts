// Type for each Player object, received from lambda endpoint

type PlayerType = {
    PLAYER_ID: number;
    PLAYER_NAME: string;
    CODE: string;
    PPG?: number;
    APG?: number;
    RPG?: number;
    GP?: number;
}

export type { PlayerType };