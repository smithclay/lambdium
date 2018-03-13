## lambdium
### serverless application repository quickstart

Lambdium allows you to run a Selenium Webdriver script written in Javascript inside of an AWS Lambda function bundled with a special version of Google Chrome (headless chrome).

For example, this script uses Selenium to automate visiting the google.com homepage and print the title to the console:

```
console.log('About to visit google.com...');
$browser.get('http://www.google.com/ncr');
$browser.wait($driver.until.titleIs('Google'), 1000);
$browser.getTitle().then(function(title) {
    console.log("title is: " + title);
});
console.log('Finished running script!');
``` 

After running this script inside of of the AWS Lambda function running lambdium, you can look at Cloudwatch logs to read the output of the script:

```
23:37:332018-03-12T23:37:33.682Z	567babb5-264e-11e8-ae20-e37b20048a93	About to visit google.com...
23:37:33 2018-03-12T23:37:33.682Z	567babb5-264e-11e8-ae20-e37b20048a93	Finished running script!
23:37:36 2018-03-12T23:37:36.860Z	567babb5-264e-11e8-ae20-e37b20048a93	title is: Google
```

### running your first selenium script

lambdium requires you to invoke it using a special event trigger: a JSON document with a single property called `Base64Script`, which is a Base64-encoded selenium script written in Javascript. The example which visits google.com looks like this:

```
{
    "Base64Script": "Ly8gU2FtcGxlIHNlbGVuaW11bS13ZWJkcml2ZXIgc2NyaXB0IHRoYXQgdmlzaXRzIGdvb2dsZS5jb20KLy8gVGhpcyB1c2VzIHRoZSBzZWxlbml1bS13ZWJkcml2ZXIgMy40IHBhY2thZ2UuCi8vIERvY3M6IGh0dHBzOi8vc2VsZW5pdW1ocS5naXRodWIuaW8vc2VsZW5pdW0vZG9jcy9hcGkvamF2YXNjcmlwdC9tb2R1bGUvc2VsZW5pdW0td2ViZHJpdmVyL2luZGV4Lmh0bWwKLy8gJGJyb3dzZXIgPSB3ZWJkcml2ZXIgc2Vzc2lvbgovLyAkZHJpdmVyID0gZHJpdmVyIGxpYnJhcmllcwovLyBjb25zb2xlLmxvZyB3aWxsIG91dHB1dCB0byBBV1MgTGFtYmRhIGxvZ3MgKHZpYSBDbG91ZHdhdGNoKQoKY29uc29sZS5sb2coJ0Fib3V0IHRvIHZpc2l0IGdvb2dsZS5jb20uLi4nKTsKJGJyb3dzZXIuZ2V0KCdodHRwOi8vd3d3Lmdvb2dsZS5jb20vbmNyJyk7CiRicm93c2VyLmZpbmRFbGVtZW50KCRkcml2ZXIuQnkubmFtZSgnYnRuSycpKS5jbGljaygpOwokYnJvd3Nlci53YWl0KCRkcml2ZXIudW50aWwudGl0bGVJcygnR29vZ2xlJyksIDEwMDApOwokYnJvd3Nlci5nZXRUaXRsZSgpLnRoZW4oZnVuY3Rpb24odGl0bGUpIHsKICAgIGNvbnNvbGUubG9nKCJ0aXRsZSBpczogIiArIHRpdGxlKTsKfSk7CmNvbnNvbGUubG9nKCdGaW5pc2hlZCBydW5uaW5nIHNjcmlwdCEnKTs="
}
```

To encode another script, you can paste the contents of a script in an online converter like [https://www.base64encode.org/](https://www.base64encode.org/) or using the following commands, which are also available as a simple shell script in `scripts/invoke.sh`:

```
SELENIUM_SCRIPT=/path/to/your/script
BASE64_ENCODED=`cat $SELENIUM_SCRIPT | openssl base64`
PAYLOAD_STRING='{"Base64Script": "'$BASE64_ENCODED'"}'
echo $PAYLOAD_STRING
```

With the payload constructed, you can then invoke the function directly in the AWS Console by defining a test event or using the AWS CLI with the payload written to a file defined in the $PAYLOAD_FILE enviornment variable. Replace the function name with the name of the function deployed by the serverless application repository (it should be `lambdium` by default).

```
aws lambda invoke --invocation-type RequestResponse --function-name lambdium --payload file://$PAYLOAD_FILE --log-type Tail $OUTPUT_FILE
``` 

### troubleshooting

Errors and failures will be written to Cloudwatch. The `DEBUG_ENV` environment variable outputs additional information about the filesystem and inputted Base64 script.

The maximum payload size is 4kb and the default timeout is 10 seconds, so this won't work with very large scripts or scripts that run a long time.

More details are available on the official Github page, https://github.com/smithclay/lambdium.
