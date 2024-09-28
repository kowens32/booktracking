import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as logs from 'aws-cdk-lib/aws-logs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BooktrackingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// Cognitio User Pool for Authentication 
const userPool = new cognito.UserPool(this, 'UserPool', {
  selfSignUpEnabled: true,
  signInAliases: {email: true},
  userPoolName: 'BookTrackingAppUserPool',
});

//Lambda Function for Adding a Book
const addBookFunction = new lambda.Function(this, 'AddBookFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'addBook.handler',
  code: lambda.Code.fromAsset('lambda'),
  environment: {
    TABLE_NAME: userDataTable.tableName,
  }
});

const getReccomendationsFunction = new lambda.Function(this, 'GetRecommendationsFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'getRecommendations.handler',
  code: lambda.Code.fromAsset('lambda'),
  environment: {
    TABLE_NAME: userDataTable.tableName,
  }
});

//APIGW to expose the lambda functions 
const api = new apigateway.RestApi(this, 'BookTrackingApi', {
  restApiName: 'Book Traclomg Service', 
  description: 'This service manages book tracking for users.',
});

const books = api.root.addResource('books');
books.addMethod('Post', new apigateway.LambdaIntegration(addBookFunction));
books.addMethod('GET', new apigateway.LambdaIntegration(getReccomendationsFunction));

// Grant necessary permissions
userDataTable.grantReadWriteData(addBookFunction);
userDataTable.grantReadWriteData(getReccomendationsFunction);
loanedBooksTable.grantReadWriteData(addBookFunction);


// //Amplify for Frontend Hosting (optional)
// const amplifyApp = new amplify.CfnApp(this, 'BookTrackingFrontend', {
//   sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
//     owner: 'kowens32',
//     repository: 'example',
//     oauthToken: cdk.SecretValue.secretsManager('github-token'),
//   }),
// });

//Cloudwatch for Monitoring 
const addBookFunctionErrors = new cloudwatch.Metric({
  namespace: 'AWS/Lambda',
  metricName: 'Errors',
  dimensionsMap: {
    FunctionName: addBookFunction.functionName,
  },
  statistic: 'sum',
});

const alarm = new cloudwatch.Alarm(this, 'AddBookErrorsAlarm', {
  metric: addBookFunctionErrors,
  threshold: 1, 
  evaluationPeriods: 1,
});
  
  }
}


