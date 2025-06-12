import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Redis } from "@upstash/redis";
import { MongoClient } from 'mongodb';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const mongoUri = process.env.MONGODB_URI!;
const mongoClient = new MongoClient(mongoUri);

interface UserInterface {
    user_id: string;
    games_played: string;
    games_won: string;
    attempts_per_win_distro: [number, number, number];
    curr_streak: number;
    longest_streak: number;
}

const updateUserStats = async (
  user_id: string, 
  session_status: "WON" | "LOST",
  attempts: 1 | 2 | 3,
): Promise<UserInterface> => {

  const db = mongoClient.db(process.env.MONGODB_DATABASE!);  
  const userCollection = db.collection(process.env.MONGODB_USER_COLLECTION!);
  const user = await userCollection.findOne<UserInterface>({ user_id });

  if (!user) throw new Error("User not found!"); // Should never run, hopefully. 

  user.games_played += 1;
  
  if (session_status == "WON") {
    user.games_won += 1;
    user.attempts_per_win_distro[attempts - 1] += 1;
    user.curr_streak += 1;
    user.longest_streak = Math.max(user.curr_streak, user.longest_streak);
  } else {
    user.curr_streak = 0;
  }

  await userCollection.replaceOne({ user_id }, user);

  return user;
}

interface EvaluateGuessEventBodyInterface {
  guesses: number[];
  attempts: 1 | 2 | 3;
  user_id: string;
}

type ResultType = "WON" | "ONGOING" | "LOST";

interface SessionCache {
  user_id: string;
  session_id: string;
  players: any[];
  solution: number[];
  attempts: number;
  category: string;
  lastGuessesAttempt?: number[];
  lastGuessesCorrect?: number | null;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body: EvaluateGuessEventBodyInterface =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    const { guesses, user_id, attempts } = body;

    if (
      !Array.isArray(guesses) ||
      typeof user_id !== "string" ||
      typeof attempts !== "number"
    ) {
      throw new Error("Invalid input format");
    }

    const sessionKey = `session:user:${user_id}`;

    const raw = await redis.hgetall(sessionKey) as Record<string, any>;

    if (!raw || Object.keys(raw).length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Session not found" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      };
    }

    const session: SessionCache = {
      user_id: raw.user_id,
      session_id: raw.session_id,
      category: raw.category,
      attempts: Number(raw.attempts),
      players: raw.players as any[],
      solution: raw.solution as number[],
      lastGuessesAttempt: raw.lastGuessesAttempt ?? [],
      lastGuessesCorrect:
        raw.lastGuessesCorrect === undefined || raw.lastGuessesCorrect === null
          ? null
          : Number(raw.lastGuessesCorrect),
    };

    let correct = 0;
    for (let i = 0; i < guesses.length; i++) {
      if (guesses[i] === session.solution[i]) correct++;
    }

    let sessionResult: ResultType;
    if (correct === guesses.length) {
      sessionResult = "WON";
    } else if (attempts < 3) {
      sessionResult = "ONGOING";
    } else {
      sessionResult = "LOST";
    }

    if (sessionResult === "WON" || sessionResult === "LOST") {
      await redis.del(sessionKey);
      await mongoClient.connect();
      const updatedUser = await updateUserStats(user_id, sessionResult, attempts);

      return {
        statusCode: 200,
        body: JSON.stringify({
          attempts,
          sessionResult,
          updatedUser,
        }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      };

    } else {
      await redis.hset(sessionKey, {
        lastGuessesAttempt: guesses,
        lastGuessesCorrect: correct,
        attempts,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        lastGuessesAttempt: guesses,
        lastGuessesCorrect: correct,
        attempts,
        sessionResult,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  } catch (error: any) {
    console.error("Error evaluating guesses:", error.message || error);
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
