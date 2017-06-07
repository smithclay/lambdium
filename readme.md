## lambdium
### simple headless chrome in lambda

This uses the chromium binaries from the [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) project to prototype running headless chromium in AWS Lambda. 

#### Requirements

* An AWS Account
* Terraform (optional but highly recommended for function creation and deploy)
* node.js + npm
* `make`

#### Suggested Reading

The function interacts with the [headless Chromium](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) process using the [Chrome Remote Debugger Protocol](https://chromedevtools.github.io/devtools-protocol/)—not Selenium.

Since this Lambda function is written using node.js, it uses the CRDP client library for node.js called [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface).

#### Installing dependencies

The headless chromium binary is too large for Github, you need to fetch it here. [Marco Lüthy](https://github.com/adieuadieu) has an excellent post on Medium about how he built chromium for for AWS Lambda [here](https://medium.com/@marco.luethy/running-headless-chrome-on-aws-lambda-fa82ad33a9eb). 

```sh
    $ ./fetch-dependencies.sh
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

The optional `DEBUG_ENV` environment variable will log additional information to Cloudwatch.

#### Running the function

TBD.

#### other projects
* [serverless-chrome](https://github.com/adieuadieu/serverless-chrome)

