// importing aws-sdk
import AWS from 'aws-sdk';

// lambda function handler
export const handler = async (params) => {

  const stepFunctions = new AWS.StepFunctions();
  
  // specifying state machine ARN
  const stateMachineArn = "arn:aws:states:us-east-1:867137677747:stateMachine:TranslateMessagesState";

  try {
    // starts execution of step function
    const executionResult = await stepFunctions.startExecution({
      stateMachineArn,
      input: params.body,
    }).promise();

    console.log('Step Functions execution started successfully:', executionResult);

    // a return response is triggered based on the successfull execution
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Step Functions execution started successfully!",
        executionArn: executionResult.executionArn,
      }),
    };
    
  } catch (error) {
    console.log("Error starting Step Functions execution:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error starting Step Functions execution',
      }),
    };
  }
};
