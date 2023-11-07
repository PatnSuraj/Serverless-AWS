// importing aws-sdk
import AWS from 'aws-sdk'

// lambda function handler
export const handler = async (params) => {
  try {
  	// creating a new AWS KMS client
    const kmsService = new AWS.KMS({ region: 'us-east-1' });
    // fetch all keys from KMS
    const allKeys = await kmsService.listKeys({}).promise();
    const keys = allKeys.Keys;

    const KeyId = keys[0].KeyId;

    const encryptionParams = {
      KeyId,
      Plaintext: params.Text,
    };

    
    // encrypting the plaintext
    const encryptedResult = await kmsService.encrypt(encryptionParams).promise();

    // displaying the result in console with status code
    console.log("Encryption result is =>", encryptedResult.CiphertextBlob.toString('base64'));
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...params,
        TranslatedText: encryptedResult.CiphertextBlob.toString('base64')
      })
    }
  } catch (err) {
  // 500 status code with error message
    console.error('Error encrypting text:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        "error": "Server Error"
      }),
    }
  }
};
