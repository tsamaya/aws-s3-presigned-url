# AWS S3 PreSigned URL

This repository demontrates how to POST, PUT and GET file from an AWS S3 Bucket with ACL private to prevent the file to be downloaded without using your application.

## Getting started

clone the repo

cd /path/to/repo

yarn install

### Setup: provision infrastructure with AWS CDK

```bash
touch packages/infra/.env
```

edit with your values

```
DEFAULT_ACCOUNT=xxxxxxxxx
DEFAULT_REGION=eu-west-1
DEPLOY_STAGE=dev
STACK_PREFIX=PresignedURL
```

Build and deploy the infrastructure

```bash
yarn setup
```

get the bucket name from the resources of the CloudFormation execution or the S3 managment console

### server

```bash
touch packages/server/.env
```

edit with your values

```
S3_ACCESS_KEY_ID=XXXXX
S3_SECRET_ACCESS_KEY=XXXX
S3_REGION=xxxx
S3_BUCKET_NAME=xxxx
```

### Try it

```bash
yarn start
```
