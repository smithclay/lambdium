## lambdium
### headless chrome + selenium webdriver in AWS Lambda

**Lambdium uses Selenium Webdriver with [Headless Chromium](https://developers.google.com/web/updates/2017/04/headless-chrome) to run Webdriver scripts written in JavaScript on AWS Lambda.** Since this project was created, AWS now offers this as a completely managed service called [Device Farm Desktop Browser Testing](https://docs.aws.amazon.com/devicefarm/latest/testgrid/what-is-testgrid.html).

You can use this AWS Lambda function by itself, bundled with your own application as a standalone AWS Lambda layer, or with other AWS services to:

* Run many concurrent selenium scripts at the same time without worrying about the infrastructure
* Run execute a selenium script via an HTTP call using API Gateway ([example app](/examples/apps/api-gateway.yaml))
* Configure Cloudwatch events to run a script on a schedule ([example app](/examples/apps/scheduled-event.yaml))
* Integrate selenium tests running in Chrome into different event-driven workflows (like CodeDeploy checks, webhooks, or uploads to an S3 bucket)

Since this Lambda function is written using node.js, you can run almost any script written for [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver). Example scripts can be found in the `examples` directory.

This uses a special version of Chrome (headless chromium) from the [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) project.

*This is highly experimental and not all chromedriver functions will work. Check [issues](https://github.com/smithclay/lambdium/issues) for known issues.*

#### Requirements and setup for local development

*This project is on the [AWS Serverless Application Repository](https://serverlessrepo.aws.amazon.com), allowing you to install it in your AWS account with one click. Install in your AWS account [here](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:156280089524:applications~lambdium).* Quickstart instructions are in the [`README-SAR.md` file](https://github.com/smithclay/lambdium/blob/master/README-SAR.md).

* An AWS Account
* The [AWS SAM Local](https://github.com/awslabs/aws-sam-local) running functions locally with the [Serverless Application Model](https://github.com/awslabs/serverless-application-model) (see: `template.yaml`, install: `npm install -g aws-sam-local`)
* node.js + npm
* `modclean` npm modules for reducing function size
* Bash

#### Local development setup

##### 1. Fetching large binary dependencies

The headless chromium binary is too large for Github, you need to fetch it using a script bundled in this repository. [Marco Lüthy](https://github.com/adieuadieu) has an excellent post on Medium about how he built chromium for for AWS Lambda [here](https://medium.com/@marco.luethy/running-headless-chrome-on-aws-lambda-fa82ad33a9eb). 

```sh
    $ ./layer/fetch-binaries.sh
```

##### 2. Building

This is now handled by the `sam build` command. In the root of this project, run:

```sh
    $ sam build
```

##### 3. Running locally with SAM Local

SAM Local can run this function on your computer inside a Docker container that acts like AWS Lambda. To run the function with an example event trigger that uses selenium to use headless chromium to visit `google.com`, run this:

```sh
    $ sam local invoke Lambdium -e event.json
```

### Deploying the function to AWS

To deploy the function to your AWS account, you'll need to have followed the instructions above to fetch dependencies. Running it locally with SAM local and the test event (in `event.json`) is a good idea to verify everything works correctly before running it in the cloud.

#### 1. Creating a S3 bucket for the function deployment

This will create a file called `packaged.yaml` you can use with Cloudformation to deploy the function.

You need to create a S3 bucket configured on your AWS account to upload the packed function files. For example:

```sh
    $ export LAMBDA_BUCKET_NAME=lambdium-upload-bucket
```

#### 2. Packaging the function for Cloudformation using SAM

```sh
    $ sam package --s3-bucket $LAMBDA_BUCKET_NAME > packaged.yaml
```

#### 3. Deploying the package using SAM

This will create the function using Cloudformation after packaging it is complete.

```sh
    $ sam deploy --template-file ./packaged.yaml --stack-name <<your-cloudformation-stack-name>> --capabilities CAPABILITY_IAM
```

If set, the optional `DEBUG_ENV` environment variable will log additional information to Cloudwatch.

### Running the function

Post-deploy, you can have AWS Lambda run a selenium script. There's an example of a selenium-webdriver simple script in the `examples/` directory that the Lambda function can now run.

Expected JSON input for the function event trigger is: `{"Base64Script": "<Base64 Encoding of Selenium Script>"}` (this can also be provided as an environment variable named `BASE64_SCRIPT`).

To run the example Selenium script, you can use the example with the AWS CLI in the `scripts` directory. It takes care of base64 encoding the file and assumes the function name is `lambdium` running in `us-west-2`:

```sh
    $ scripts/invoke.sh
```

To use your own `selenium-webdriver` script:

```sh
    $ scripts/invoke.sh ~/Desktop/my-script.js
```

#### Related projects
* [serverless-chrome](https://github.com/adieuadieu/serverless-chrome)
* [How to Get Headless Chrome on Lambda by Marco Lüthy](https://medium.com/@marco.luethy/running-headless-chrome-on-aws-lambda-fa82ad33a9eb)
* [Getting Started with Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome)
* [Selenium Webdriver 3.0 Docs](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html)
