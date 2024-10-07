import { PlayerDataInterface, SolutionMapInterface } from "../Types/store";

export const generateScoresArray = (guesses: PlayerDataInterface[], solution_map: SolutionMapInterface) => {
    
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
    };

    return temp_scores;
}