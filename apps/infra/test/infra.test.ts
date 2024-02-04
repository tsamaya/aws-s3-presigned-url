import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Infra from '../lib/infra-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/infra-stack.ts
test('Bucket Created', () => {
  const app = new cdk.App();
  const stackName = 'infra-aws-teststack';
  // WHEN
  const stack = new Infra.InfraStack(app, stackName);
  // THEN
  const template = Template.fromStack(stack);
  //   console.log(JSON.stringify(template));
  // it checks bucket is private
  template.hasResourceProperties('AWS::S3::Bucket', {
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true,
    },
    CorsConfiguration: {
      CorsRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'POST', 'PUT'],
          AllowedOrigins: ['*'],
        },
      ],
    },
  });
  // it checks the outputs exist
  template.hasOutput('s3BucketArn', {});
  template.hasOutput('s3BucketName', {});
});
