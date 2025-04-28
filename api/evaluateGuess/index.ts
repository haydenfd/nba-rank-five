import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";


interface EvaluateGuessEventBodyInterface {
    guesses: number[];
    solution: number[];
    attempts: 1 | 2 | 3;
    user_id: string; 
}; 

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const body = JSON.parse(event.body!) as EvaluateGuessEventBodyInterface;
      const { guesses, solution, user_id, attempts } = body;
  
      const scores: number[] = [];
      let totalCorrect = 0;
  
      for (let i = 0; i < guesses.length; i++) {
        const correct = guesses[i] === solution[i] ? 1 : 0;
        scores.push(correct);
        totalCorrect += correct;
      }
  
      let result: number;
      if (totalCorrect === scores.length) {
        result = 1; // win
      } else if (attempts < 3) {
        result = 0; // active
      } else {
        result = 2; // loss
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ scores, result }),
      };
    } catch (error) {
      console.error("Error evaluating guesses:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error." }),
      };
    }
  };