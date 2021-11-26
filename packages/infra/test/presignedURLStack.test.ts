import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { PresignedURLStack } from '../lib/presignedURLStack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/aws-resources-stack.ts
test('S3 Bucket Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new PresignedURLStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

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
});
