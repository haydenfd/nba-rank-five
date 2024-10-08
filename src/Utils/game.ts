const resetGameLocalStorage = (session_id: string) => {
  localStorage.setItem("rank_five_session_id", session_id);
  localStorage.setItem("rank_five_session_status", JSON.stringify(0));
  localStorage.setItem("rank_five_last_guess", JSON.stringify([]));
  localStorage.setItem("rank_five_session_attempts", JSON.stringify(0));
};

const initializeNewUserLocalStorage = (user_id: string, session_id: string) => {
  localStorage.setItem("rank_five_user_id", user_id);
  resetGameLocalStorage(session_id);
};

export { resetGameLocalStorage, initializeNewUserLocalStorage };
