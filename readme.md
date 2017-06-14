## lambdium
### headless chrome + selenium webdriver in AWS Lambda

This uses the binaries from the [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) project to prototype running headless chromium with `selenium-webdriver` in AWS Lambda. I've also bundled the chromedriver binary so the browser can be interacted with using the [Webdriver Protocol](https://www.w3.org/TR/webdriver/).

#### Background

The function interacts with [headless Chromium](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) process using [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/) and a popular webdriver node.js client library. 

*This is highly experimental and not all chromedriver functions will work. Check [issues](https://github.com/smithclay/lambdium/issues) for known issues.*

Since this Lambda function is written using node.js, you can run almost any script written for [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver). Example scripts can be found in the `examples` directory.

## Installation

> If you don't want to build the archive, You can also download a pre-built AWS Lambda *.zip that you can upload directly to a new function using the AWS CLI or Console. Visit [lambdium releases](https://github.com/smithclay/lambdium/releases).

#### Requirements

* An AWS Account
* [Terraform](https://terraform.io) (optional but highly recommended for function creation and deploy)
* node.js + npm
* `make`

#### Fetching dependencies

The headless chromium binary is too large for Github, you need to fetch it using a script bundled in this repository. [Marco Lüthy](https://github.com/adieuadieu) has an excellent post on Medium about how he built chromium for for AWS Lambda [here](https://medium.com/@marco.luethy/running-headless-chrome-on-aws-lambda-fa82ad33a9eb). 

```sh
    $ ./scripts/fetch-dependencies.sh
```

#### Building Lambda `.zip` archive

```sh
    $ make
```

#### Creating and Deploying Using Terraform

This will create the function using Terraform with all required permissions.

```sh
    $ make deploy
```

The optional `DEBUG_ENV` environment variable will log additional information to Cloudwatch. The `PATH` environment variable points to the `bin` directory in this project—this is required in order to launch the `chromedriver` process.

## Usage

If dependencies are installed and `make deploy` succeeds you can have Lambda run a script. There's an example of a selenium-webdriver simple script in the `examples/` directory that the Lambda function can now run.

Expected JSON input for the function: `{"Base64Script": "<Base64 Encoding of Selenium Script>"}`

To run the example Selenium script, you can use the example with the AWS CLI in the `scripts` directory. It takes care of base64 encoding the file:

```sh
    $ scripts/invoke.sh
```

To use your own `selenium-webdriver` script:

```sh
    $ scripts/invoke.sh ~/Desktop/my-script.js
```

#### Related projects
* [serverless-chrome](https://github.com/adieuadieu/serverless-chrome)

