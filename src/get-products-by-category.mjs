import aws from 'aws-sdk';const dynamodb = new aws.DynamoDB.DocumentClient();exports.handler = async (event) => {  try {    // Extract category ID from the request payload or event    const {categoryId} = event; // Adjust how you extract the category ID based on your event structure    // Define the parameters for the query    const params = {      TableName: 'YourTableName',      IndexName: 'GSI1', // Name of your GSI      KeyConditionExpression: '#category = :categoryValue',      ExpressionAttributeNames: {        '#category': 'GS1-PK' // Attribute name of the GSI partition key      },      ExpressionAttributeValues: {        ':categoryValue': `CATEGORY#${categoryId}` // Value of the category ID      }    };    // Query the GSI to get all products in the specified category    const result = await dynamodb.query(params).promise();    // Process the query result    const products = result.Items;    console.log('Products in category', categoryId, ':', products);    // Return the products as the response    return {      statusCode: 200,      body: JSON.stringify(products)    };  } catch (error) {    console.error('Error querying products by category:', error);    return {      statusCode: 500,      body: JSON.stringify({ message: 'Error querying products by category', error: error })    };  }};