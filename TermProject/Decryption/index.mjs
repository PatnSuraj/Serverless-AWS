// importing aws-sdk
import AWS from 'aws-sdk'

// lambda function handler
export const handler = async (params) => {
  try {
    // Function to convert base64 string to buffer
    function bufferConvertion(basbuf) {
      var decodedValue = atob(basbuf);
      // into uint8Array
      var bytes = new Uint8Array(decodedValue.length);
      
      var cur = 0;
      while (cur < decodedValue.length) {
        bytes[cur] = decodedValue.charCodeAt(cur);
        cur++;
      }
      return bytes.buffer;
    }
    const kmsService = new AWS.KMS({ region: 'us-east-1' });

    // fetch all keys from KMS
    const allKeys = await kmsService.listKeys({}).promise();
    const keys = allKeys.Keys;

    const KeyId = keys[0].KeyId;

    const decryptParameters = {
      KeyId,
      CiphertextBlob: bufferConvertion(JSON.parse(params.body).Text),
    };


    // console.log("Parsed body", JSON.parse(params.body));
    
    // decrypting the data with the paramters initialized
    const result = await kmsService.decrypt(decryptParameters).promise();

    // displays the readable format string with a status code
    console.log("result is =>", result.Plaintext.toString());

    // returns the data with specific status code based on the functions execution
    return {
      statusCode: 200,
      body: JSON.stringify({
        TranslatedText: result.Plaintext.toString()
      })
    }
  } catch (err) {
    console.error('Error decrypting text:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        "error": "Server Error"
      }),
    }
  }
};
