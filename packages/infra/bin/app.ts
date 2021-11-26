#!/usr/bin/env node
// require('dotenv').config();

import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from '@aws-cdk/core';
import { PresignedURLStack } from '../lib/presignedURLStack';

dotenv.config();

if (!process.env.DEFAULT_ACCOUNT)
  throw new Error('Missing environment variable `DEFAULT_ACCOUNT`.');

if (!process.env.DEFAULT_REGION)
  throw new Error('Missing environment variable `DEFAULT_REGION`.');

if (!process.env.STACK_PREFIX)
  throw new Error('Missing environment variable `STACK_PREFIX`.');

if (!process.env.DEPLOY_STAGE)
  throw new Error('Missing environment variable `DEPLOY_STAGE`.');

console.log(
  `Using ${process.env.DEFAULT_ACCOUNT}/${process.env.DEFAULT_REGION}`
);

const app = new cdk.App();
new PresignedURLStack(
  app,
  `${process.env.STACK_PREFIX}-${process.env.DEPLOY_STAGE}`,
  {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    env: {
      account: process.env.DEFAULT_ACCOUNT,
      region: process.env.DEFAULT_REGION,
    },

    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  }
);
