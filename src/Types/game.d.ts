import { PlayerDataInterface, SolutionMapInterface } from "./store";

interface GuessCrumbsInterface {
    solution_map: SolutionMapInterface,
    guesses: PlayerDataInterface[],
}


export {
    GuessCrumbsInterface,
};