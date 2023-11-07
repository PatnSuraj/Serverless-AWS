// importing aws-sdk
import AWS from 'aws-sdk'

// DynamoDB client instance creation
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Table name
const tableName = 'translatedMessages';

// lambda function handler
export const handler = async (params) => {
  const parsedObj = JSON.parse(params.body);
  const paramsToSave = {
    TableName: tableName,
    Item: {
      // generating unque id
      id: new Date().getTime().toString(),
      // storing the translated text into encrypted text
      encryptedText: parsedObj.TranslatedText,
    },
  };

  try {
    // Saving data in dynamoDB
    await dynamoDB.put(paramsToSave).promise();
    console.log('Item saved successfully:', paramsToSave);
  } catch (err) {
    console.error('Error saving item:', err);
  } finally {
    return parsedObj.TranslatedText;
  }

};
