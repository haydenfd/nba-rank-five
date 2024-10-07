import { PlayerDataInterface, SolutionMapInterface } from "../Types/store";

const generateScoresArray = (
  guesses: PlayerDataInterface[],
  solution_map: SolutionMapInterface,
): number[] => {
  const temp_scores = [];

  if (guesses.length > 0) {
    for (let i = 0; i < guesses.length; i++) {
      const currPlayerId = guesses[i].PLAYER_ID;
      const currPlayerCorrectIdx = solution_map[currPlayerId];
      let diff = Math.abs(i - currPlayerCorrectIdx);
      if (diff > 0) {
        diff = 1;
      }
      temp_scores.push(diff);
    }
  }

  return temp_scores;
};

const resetGameLocalStorage = (session_id:string) => {
    localStorage.setItem("rank_five_session_id", session_id);
    localStorage.setItem("rank_five_session_status", JSON.stringify(0));
    localStorage.setItem("rank_five_last_guess", JSON.stringify([]));
    localStorage.setItem("rank_five_session_attempts", JSON.stringify(0));
};


const initializeNewUserLocalStorage = (user_id: string, session_id:string) => {
    localStorage.setItem("rank_five_user_id", user_id);
    resetGameLocalStorage(session_id);
};


export {
    generateScoresArray,
    resetGameLocalStorage,
    initializeNewUserLocalStorage,
};