import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class PresignedURLStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, id, {
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
  }
}
