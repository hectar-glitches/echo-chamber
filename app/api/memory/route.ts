import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { NextRequest } from 'next/server';
import { summarizeMemory } from '@/lib/openai';

export async function GET(req: NextRequest) {
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);
  const command = new ScanCommand({ TableName: process.env.DYNAMODB_MEMORY_TABLE! });
  try {
    const data = await ddbDocClient.send(command);
    return new Response(JSON.stringify(data.Items), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch memories' }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { memory } = await req.json();
  const summary = await summarizeMemory(memory.content);
  const client = new DynamoDBClient({ region: process.env.AWS_REGION });
  const ddbDocClient = DynamoDBDocumentClient.from(client);
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_MEMORY_TABLE!,
    Item: {
      id: crypto.randomUUID(),
      ...memory,
      summary,
      createdAt: new Date().toISOString(),
    },
  });
  try {
    await ddbDocClient.send(command);
    return new Response(JSON.stringify({ message: 'Memory saved' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save memory' }), { status: 500 });
  }
}
