const resetGameLocalStorage = (session_id: string) => {
  localStorage.setItem("rank_five_session_id", session_id);
  localStorage.setItem("rank_five_session_status", JSON.stringify(0));
  localStorage.setItem("rank_five_last_guess", JSON.stringify([]));
  localStorage.setItem("rank_five_session_attempts", JSON.stringify(0));
  localStorage.removeItem("rank_five_session_solution");

};

const initializeNewUserLocalStorage = (user_id: string, session_id: string) => {
  localStorage.setItem("rank_five_user_id", user_id);
  resetGameLocalStorage(session_id);
};

/* Begin - Stats computation functions */

const computeWeightedAvg = (arr: [number, number, number], wins: number): number => {
  if (wins === 0) return 0;
  return (1 * arr[0] + 2 * arr[1] + 3 * arr[2]) / wins;
};

const computeWinPercentage = (wins: number, games_played: number): string => {
  return games_played === 0 ? "0.0" : (100 * (wins / games_played)).toFixed(1);
};

/* End - Stats computation functions */

export { resetGameLocalStorage, initializeNewUserLocalStorage, computeWeightedAvg, computeWinPercentage };
