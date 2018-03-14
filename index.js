const webdriver = require('selenium-webdriver');
const child = require('child_process');
const fs = require('fs');

const chromium = require('./lib/chromium');
const sandbox = require('./lib/sandbox');
const log = require('lambda-log');

log.info('Loading function');

// Create new session (spawns chromium and webdriver)
$browser = chromium.createSession();

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  /*if (process.env.CLEAR_TMP) {
    log.info('attempting to clear /tmp directory')
    log.info(child.execSync('rm -rf /tmp/core*').toString());
  }*/

  if (process.env.DEBUG_ENV || process.env.SAM_LOCAL) {
    log.config.debug = true;
    log.config.dev = true;
  }

  if (process.env.LOG_DEBUG) {
    log.debug(child.execSync('pwd').toString());
    log.debug(child.execSync('ls -lhtra .').toString());
    log.debug(child.execSync('ls -lhtra /tmp').toString());  
  }

  log.info(`Received event: ${JSON.stringify(event, null, 2)}`);
  
  // Read input
  const inputParam = event.Base64Script || process.env.BASE64_SCRIPT;
  if (typeof inputParam !== 'string') {
    return callback('Expected Base64Script string as input.');
  }

  const inputBuffer = Buffer.from(inputParam, 'base64').toString('utf8');
  log.debug(`Executing script "${inputBuffer}"`);

  sandbox.executeScript(inputBuffer, $browser, webdriver, function(err) {
    if (process.env.LOG_DEBUG) {
      log.debug(child.execSync('ps aux').toString());
      log.debug(child.execSync('cat /tmp/chromedriver.log').toString())
    }
    if (err) {
      callback(err, null);
    }

    callback(null, 'Finished executing script');
  });
};
