# AWS S3 PreSigned URL

This repository demontrates how to POST, PUT and GET file from an AWS S3 Bucket with ACL private to prevent the file to be downloaded without using your application.

## Prerequisite

- Node 18 (via nvm: `nvm use`)

- pnpm (install via `corepack enable`)

- aws cli (`brew install awscli`)

## Getting started

clone the repo

cd /path/to/repo

pnpm install

## Test

```bash
pnpm test
```

### Setup: provision infrastructure with AWS CDK

```bash
touch apps/infra/.env
```

edit with your values

```
CDK_DEFAULT_ACCOUNT=xxxxxxxxx
CDK_DEFAULT_REGION=eu-west-1
CDK_DEPLOY_STAGE=dev
CDK_STACK_PREFIX=presigned-url
```

## AWS infra

first time

```bash
aws configure --profile <your-aws-profile>
```

to get the ACCOUNT-NUMBER REGION

```bash
aws sts get-caller-identity --profile <your-aws-profile>
aws configure get region --profile <your-aws-profile>
```

or without the profile `--profile <your-aws-profile>` when only one account is configured

### once per region

```bash
pnpx cdk bootstrap aws://ACCOUNT-NUMBER/REGION --profile <your-aws-profile>
```

in my case

```bash
pnpx cdk bootstrap aws://zzzxxxuuuiii/eu-west-1 --profile tsamaya
# Packages: +3
# +++
# Progress: resolved 3, reused 2, downloaded 1, added 3, done
# Using zzzxxxuuuiii/eu-west-1
#  ⏳  Bootstrapping environment aws://zzzxxxuuuiii/eu-west-1...
# Trusted accounts for deployment: (none)
# Trusted accounts for lookup: (none)
# Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
# CDKToolkit: creating CloudFormation changeset...
#  ✅  Environment aws://zzzxxxuuuiii/eu-west-1 bootstrapped.
```

Build and deploy the infrastructure

```bash
pnpm run deploy:infra
# or pnpm run deploy:infra -- --profile tsamaya
# in my case pnpm run deploy:infra -- --profile tsamaya

# infra: Packages: +3
# infra: +++
# infra: Progress: resolved 3, reused 3, downloaded 0, added 3, done
# infra: Using zzzxxxuuuiii/eu-west-1
# infra: ✨  Synthesis time: 2.27s
# ...
# infra:  ✅  presigned-url-dev
# infra: ✨  Deployment time: 43.21s
# infra: Outputs:
# infra: presigned-url-dev.s3BucketArn = arn:aws:s3:::presignedurldevfiles183189EF
# infra: presigned-url-dev.s3BucketName = presignedurldevfiles183189EF
# infra: Stack ARN:
# infra: arn:aws:cloudformation:eu-west-1:zzzxxxuuuiii:stack/presigned-url-dev/0d123dc0-c2c1-11ee-a031-0ae2cf666b7e
# infra: ✨  Total time: 45.48s

```

get the bucket name from the resources of the CloudFormation execution or the S3 managment console

### server

```bash
touch apps/server/.env
```

edit with your values

```yml
S3_ACCESS_KEY_ID=XXXXX
S3_SECRET_ACCESS_KEY=XXXX
S3_REGION=eu-west-1

# from the infra deployment
S3_BUCKET_NAME=xxxx
# in my case infra: presigned-url-dev.s3BucketName = presignedurldevfiles183189EF
# S3_BUCKET_NAME=presignedurldevfiles183189EF
```

### Try it

```bash
pnpm start
```
