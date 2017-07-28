variable "aws_access_key" {}
variable "aws_secret_key" {}

variable "aws_region" {
  default = "us-west-2"
}

provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region     = "${var.aws_region}"
}

// Allow Logging and X-Ray Access
resource "aws_iam_role_policy" "iam_role_policy_for_lambda" {
  name = "iam_role_policy_form_lambdium2"
  role = "${aws_iam_role.iam_for_lambda.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams",
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
      ],
      "Effect": "Allow",
      "Resource": [
        "*"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambdium2"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "lambdium" {
  filename         = "lambda_function.zip"
  function_name    = "lambdium2"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  handler          = "index.handler"
  source_code_hash = "${base64sha256(file("lambda_function.zip"))}"
  runtime          = "nodejs6.10"
  timeout          = 20
  memory_size      = 1152

  // Total size of enviornment variables must not exceed 4KB.
  // http://docs.aws.amazon.com/lambda/latest/dg/limits.html
  environment {
    variables = {
      DEBUG_ENV = "true"
      // Nasty hack because chromium doesn't clear the tmp directory
      CLEAR_TMP = "true"
      BASE64_SCRIPT = "Ly8gSW50ZXJhY3Qgd2l0aCBhIFJlYWN0IFNQQSBhcHAuCgokYnJvd3Nlci5nZXQoJ2h0dHBzOi8vZDNxMnlranFtenQxemwuY2xvdWRmcm9udC5uZXQvJykudGhlbihmdW5jdGlvbigpewogIHJldHVybiAkYnJvd3Nlci5maW5kRWxlbWVudCgkZHJpdmVyLkJ5LmlkKCdwbGF5LXJhY2UnKSkudGhlbihmdW5jdGlvbihlbGVtZW50KXsKICAgIHJldHVybiBlbGVtZW50LmNsaWNrKCkudGhlbihmdW5jdGlvbigpewogICAgICAkYnJvd3Nlci53YWl0KGZ1bmN0aW9uKCkgewogICAgICAgIHJldHVybiAkZHJpdmVyLnVudGlsLmVsZW1lbnRMb2NhdGVkKCRkcml2ZXIuQnkueHBhdGgoIi8vKltjb250YWlucyh0ZXh0KCksJyMxJyldIikpOwogICAgICB9LCAxMDAwMCkudGhlbihmdW5jdGlvbigpIHsKICAgICAgICBjb25zb2xlLmxvZygnUmFjZSBmaW5pc2hlZCEnKTsKICAgICAgICAkYnJvd3Nlci5jbG9zZSgpOwogICAgICB9KTsKICAgIH0pOwogIH0pOwp9KTs="
      PATH = "/var/lang/bin:/usr/local/bin:/usr/bin/:/bin:/var/task/bin"
    }
  }
}
