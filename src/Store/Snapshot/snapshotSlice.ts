import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SnapshotInterface,
  PlayerDataInterface,
  SolutionMapInterface,
  AttemptsType,
} from '../../Types/store';

const savedAttempts = localStorage.getItem("rank_five_session_attempts");
const initialAttempts = savedAttempts ? parseInt(savedAttempts, 10) : 0;

const initialSnapshotState: SnapshotInterface = {
  players: [],
  guesses: [],
  solution_map: {},
  scores: [],
  attempts: initialAttempts as AttemptsType,
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
      state.scores = [];
      state.solution_map = {};
    },

    initializeGame: (state, action: PayloadAction<InitializeGamePayload>) => {
      const { players, solution_map } = action.payload;
      state.players = players;
      state.solution_map = solution_map;
      console.log(state.players);
      console.log(state.solution_map)
    },    
    incrementAttempts: (state) => {
      if (state.attempts !== 2) {
        state.attempts += 1;
        localStorage.setItem("rank_five_session_attempts", state.attempts.toString());
      }
    },
    mutateGuesses: (state, action) => {
      state.guesses = action.payload;
    },

    computeScore: (state) => {
      const temp_scores = [];

      if (state.guesses.length > 0) {

        for (let i = 0; i < state.guesses.length; i++) {
          const currPlayerId = state.guesses[i].PLAYER_ID;
          const currPlayerCorrectIdx = state.solution_map[currPlayerId];
          let diff = Math.abs(i - currPlayerCorrectIdx);
          if (diff > 0) {
            diff = 1;
          }
          temp_scores.push(diff);
        }

        state.scores = temp_scores;
      }
    },
  },
});

export default snapshotSlice.reducer;

export const { initializeGame , computeScore, mutateGuesses, incrementAttempts, resetGameState} = snapshotSlice.actions;
