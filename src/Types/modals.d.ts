interface GenericModalsPropsInterface {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface SolutionModalPropsInterface extends GenericModalsPropsInterface {
  scores: number[];
}

interface StatsBoxPropsInterface {
  value: string;
  context: string;
}

interface StatsModalStateInterface {
  games_played: number;
  wins: number;
  longest_streak: number;
  current_streak: number;
  attempts_distribution: [number, number, number];
}

export { SolutionModalPropsInterface, GenericModalsPropsInterface, StatsBoxPropsInterface, StatsModalStateInterface };
