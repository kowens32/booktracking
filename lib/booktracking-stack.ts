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

const addBookFunction = new lambda.Function(this, 'GetRecommendationsFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'getRecommendations.handler',
  code: lambda.Code.fromAsset('lambda'),
  environment: {
    TABLE_NAME: userDataTable.tableName,
  }
});

  }
}
