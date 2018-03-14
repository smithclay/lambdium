const webdriver = require('selenium-webdriver');
const child = require('child_process');
const fs = require('fs');

const chromium = require('./lib/chromium');
const sandbox = require('./lib/sandbox');
const { log } = require('./lib/helpers');

console.log('Loading function');

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (process.env.CLEAR_TMP) {
    log('attempting to clear /tmp directory')
    log(child.execSync('rm -rf /tmp/core*').toString());
  }

  if (process.env.DEBUG_ENV) {
    //log(child.execSync('set').toString());
    log(child.execSync('pwd').toString());
    log(child.execSync('ls -lhtra .').toString());
    log(child.execSync('ls -lhtra /tmp').toString());
  }

  log('Received event:', JSON.stringify(event, null, 2));
  
  // Read input
  const inputParam = event.Base64Script || process.env.BASE64_SCRIPT;
  if (typeof inputParam !== 'string') {
    return callback('Expected Base64Script string as input.');
  }

  const inputBuffer = Buffer.from(inputParam, 'base64').toString('utf8');
  if (process.env.DEBUG_ENV) {
    log(`Executing "${inputBuffer}"`);
  }

  // Start selenium webdriver session
  $browser = chromium.createSession();
  sandbox.executeScript(inputBuffer, $browser, webdriver, chromium, function(err) {
    if (process.env.DEBUG_ENV) {
      log(child.execSync('ps aux').toString());
    }

    if (err) {
      callback(err, null);
    }

    callback(null, 'Finished executing script');
  });
};
