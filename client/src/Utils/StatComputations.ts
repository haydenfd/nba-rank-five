const computeWeightedAvg = (arr: [number, number, number], wins: number): number => {
  if (wins === 0) return 0;
  return (1 * arr[0] + 2 * arr[1] + 3 * arr[2]) / wins;
};

const computeWinPercentage = (wins: number, games_played: number): string => {
  return games_played === 0 ? "0.0" : (100 * (wins / games_played)).toFixed(1);
};

export { computeWeightedAvg, computeWinPercentage };
