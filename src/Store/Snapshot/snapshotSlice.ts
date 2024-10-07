import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SnapshotInterface,
  PlayerDataInterface,
  SolutionMapInterface,
  AttemptsType,
} from "../../Types/store";

const initialSnapshotState: SnapshotInterface = {
  players: [],
  guesses: [],
  solution_map: {},
  attempts: localStorage.getItem("rank_five_session_attempts")
    ? (Number(
        localStorage.getItem("rank_five_session_attempts"),
      ) as AttemptsType)
    : (0 as AttemptsType),
};

interface InitializeGamePayload {
  players: PlayerDataInterface[];
  solution_map: SolutionMapInterface;
}

const snapshotSlice = createSlice({
  name: "snapshot",
  initialState: initialSnapshotState,

  reducers: {
    resetGameState: (state) => {
      state.attempts = 0;
      state.players = [];
      state.guesses = [];
      state.solution_map = {};
    },

    initializeGame: (state, action: PayloadAction<InitializeGamePayload>) => {
      const { players, solution_map } = action.payload;
      state.players = players;
      state.solution_map = solution_map;

    },
    incrementAttempts: (state) => {
      const curr_state = state.attempts + 1;
      state.attempts = curr_state as AttemptsType;
      console.log(curr_state);
    },
    mutateGuesses: (state, action) => {
      state.guesses = action.payload;
    },
  },
});

export default snapshotSlice.reducer;

export const {
  initializeGame,
  mutateGuesses,
  incrementAttempts,
  resetGameState,
} = snapshotSlice.actions;
