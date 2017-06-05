## lambdium
### simple headless chrome in lambda

This uses the chromium binaries from the [serverless-chrome](https://github.com/adieuadieu/serverless-chrome) project to prototype running headless chromium in AWS Lambda. 

#### Requirements

* An AWS Account
* Terraform (optional but highly recommended for function creation and deploy)
* node.js + npm
* `make`

#### Building Lambda `.zip` archive

```sh
    $ make
```

#### Creating and Deploying Using Terraform

This will create the function using Terraform with all required permissions.

```sh
    $ make deploy
```

#### other projects
* [serverless-chrome](https://github.com/adieuadieu/serverless-chrome)

