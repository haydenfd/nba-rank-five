import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from '@upstash/redis';

const CATEGORIES = ['PPG', 'APG', 'RPG', 'GP'] as const;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const generateSolution = (players: any, category: string) => {
  return [...players]
    .sort((a, b) => b[category] - a[category])
    .map((player) => player.PLAYER_ID);
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const mongoUri = process.env.MONGODB_URI!;
  const mongoClient = new MongoClient(mongoUri);

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    const { user_id } = JSON.parse(event.body);

    if (!user_id) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ error: "user_id is required" }),
      };
    }

    await mongoClient.connect();
    const db = mongoClient.db(process.env.MONGODB_DATABASE!);

    const selectedCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    
    const playerCollection = db.collection(process.env.MONGODB_PLAYER_COLLECTION!);
    const players = await playerCollection.aggregate([
      { $sample: { size: 5 } },
      { 
        $project: {
          PLAYER_ID: 1,
          PLAYER_NAME: 1,
          CODE: 1,
          [selectedCategory]: 1,
          _id: 0
        }
      }
    ]).toArray();
    
    const solution = generateSolution(players, selectedCategory);
    
    const session_id = uuidv4();
    const session = {
      user_id,
      session_id,
      players,
      solution,
      attempts: 0,
      category: selectedCategory
    };
    

    await redis.set(`session:user:${user_id}`, JSON.stringify(session));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error("Error creating session:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Failed to create session" }),
    };
  } finally {
    await mongoClient.close();
  }
};
