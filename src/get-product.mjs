import aws from 'aws-sdk';
import awsXRay from 'aws-xray-sdk';
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "OnlineShop";

awsXRay.captureAWS(aws);

export async function handler(event) {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
  };
  try {
    const segment = awsXRay.getSegment();
    const subSegment = segment.addNewSubsegment('GetEventInDynamoDb');
    subSegment.addAnnotation('product id', event.pathParameters.id);

    body = await dynamo.send(
        new GetCommand({
          TableName: tableName,
          Key: {
            id: 'PRODUCT#' + event.pathParameters.id,
          },
        })
    );

    subSegment.close();
    body = body.Item;
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {statusCode, body, headers};
}
