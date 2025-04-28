import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI!;
const mongoClient = new MongoClient(mongoUri);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {

    await mongoClient.connect();
    const db = mongoClient.db("nba-rank-five");
    const userCollection = db.collection("rank-five-users");

    const userId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const newUser = {
      user_id: userId,
      games_played: 0,
      games_won: 0,
    };

    await userCollection.insertOne(newUser);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        user: newUser,
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Failed to create user" }),
    };
  } finally {
    await mongoClient.close();
  }
};
