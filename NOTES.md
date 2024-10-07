# Notes 

## Main page on load useEffect scenarios

- New user, new session (Init user_id, session_id)
- Old session
    - Terminated (user lost or won)
        -> How many attempts? 
        -> Maybe scores of attempts?
    - Active
        -> Guesses made? Need the previous list of guesses made to display crumbs. Initialize to players array. 
        -> No guesses made? Should be good. 

## What goes in local storage?

- User_id
- Session_id
- Session_status

- Only update sessions after the session is over. Until then, keep it in local storage.
- Need to keep last guesses in local storage. Will need to compute scores using param solution map and last guesses. 



## What stats are good?
- Played
- Wins
- Longest Streak
- Current Streak
- Attempts Distribution(when winning)
- Average attempts / game
- 

