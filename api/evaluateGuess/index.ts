import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Redis} from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface EvaluateGuessEventBodyInterface {
    guesses: number[];
    attempts: 1 | 2 | 3;
    user_id: string; 
}; 

// 1 = win, 0 = active, -1 = loss
type ResultType = 1 | 0 | -1;

interface SessionCache {
  user_id: string;
  session_id: string;
  players: any[];
  solution: number[];
  attempts: number;
  category: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      // const solution = [1,2,3,4,5,6];
      const body = JSON.parse(event.body!) as EvaluateGuessEventBodyInterface;
      const { guesses, user_id, attempts } = body;

      const sessionData = await redis.get(`session:user:${user_id}`);

      const session: SessionCache = typeof sessionData === "string"
  ? JSON.parse(sessionData)
  : sessionData as SessionCache;

      const solution = session.solution;


      const guessesLength = guesses.length;
      let totalCorrectGuesses = 0;

      for (let i = 0; i < guessesLength; i++) {
        totalCorrectGuesses += (guesses[i] === solution[i]) ? 1 : 0;
      }

      let sessionResult: ResultType;

      if (totalCorrectGuesses === guessesLength) {
        sessionResult = 1;
      } else if (attempts < 3) {
        sessionResult = 0;
      } else {
        sessionResult = -1;
      }
      
      // Update the attempts value in the session object
      session.attempts = attempts;
      // Save the updated session back to Redis
      await redis.set(`session:user:${user_id}`, JSON.stringify(session));
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          correct_guesses: totalCorrectGuesses,
          session_result: sessionResult,
          attempts,
        }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },        
      };
    } catch (error) {
      console.error("Error evaluating guesses:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error." }),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },        
      };
    }
  };