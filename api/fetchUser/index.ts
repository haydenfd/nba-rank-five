import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI!;
const mongoClient = new MongoClient(mongoUri);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const userId = body.user_id;
    
    if (!userId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "user_id is required in request body" }),
      };
    }

    await mongoClient.connect();
    const db = mongoClient.db(process.env.MONGODB_DATABASE!);
    const userCollection = db.collection(process.env.MONGODB_USER_COLLECTION!);

    const user = await userCollection.findOne({ user_id: userId });

    if (!user) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(user),
    };
  } catch (e) {
    console.error("Error fetching user:", e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to fetch user" }),
    };
  } finally {
    await mongoClient.close();
  }
};
