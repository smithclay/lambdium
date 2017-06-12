## lambdium
### headless chrome + selenium webdriver in AWS Labmda

This uses the binaries from the [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) project to prototype running headless chromium with `selenium-webdriver` in AWS Lambda. 

#### Requirements

* An AWS Account
* Terraform (optional but highly recommended for function creation and deploy)
* node.js + npm
* `make`

#### Suggested Reading

The function interacts with  [headless Chromium](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) process using [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/). This is highly experimental and not all chromedriver functions will work.

Since this Lambda function is written using node.js, it you can run almost any script written for [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver).

#### Installing dependencies

The headless chromium binary is too large for Github, you need to fetch it using a script bundled in this repository. [Marco Lüthy](https://github.com/adieuadieu) has an excellent post on Medium about how he built chromium for for AWS Lambda [here](https://medium.com/@marco.luethy/running-headless-chrome-on-aws-lambda-fa82ad33a9eb). 

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

The optional `DEBUG_ENV` environment variable will log additional information to Cloudwatch. The `PATH` environment variable points to the `bin` directory in this project—this is required in order to launch the `chromedriver` process.

#### Running the function

TBD.

#### other projects
* [serverless-chrome](https://github.com/adieuadieu/serverless-chrome)

