import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucketName = `${id}-files`;
    const bucket = new s3.Bucket(this, bucketName, {
      // 👇 bucket name, keep commented so CDK gives a unique bucket name
      // bucketName: bucketName,

      // 👇 Setting up CORS
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
      // 👇 Setting up Public Access => BLOCK ALL
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

      // 👇 Delete bucket on stack destroy ( Clean Up )
      removalPolicy: cdk.RemovalPolicy.DESTROY,

      // 👇 Delete bucket even non empty one: ⚠️ this dangerous and requires an asset (lambda function added)
      // autoDeleteObjects: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 's3BucketArn', {
      value: bucket.bucketArn,
    });
    new cdk.CfnOutput(this, 's3BucketName', {
      value: bucket.bucketName,
    });
    //
  }
}
