#!/bin/sh
DEFAULT_SCRIPT="examples/visitgoogle.js"
SELENIUM_SCRIPT=${1:-$DEFAULT_SCRIPT}

OUTPUT_FILE=$(mktemp)
PAYLOAD_FILE=$(mktemp)

echo "Preparing $SELENIUM_SCRIPT for execution..."

BASE64_ENCODED=`cat $SELENIUM_SCRIPT | openssl base64`
echo $BASE64_ENCODED
echo 'Invoking function...'

PAYLOAD_STRING='{"Base64Script": "'$BASE64_ENCODED'"}'
echo $PAYLOAD_STRING > $PAYLOAD_FILE

aws lambda invoke --invocation-type RequestResponse --function-name lambdium --payload file://$PAYLOAD_FILE --region us-west-2 --log-type Tail $OUTPUT_FILE

cat $OUTPUT_FILE

rm $PAYLOAD_FILE
rm $OUTPUT_FILE
