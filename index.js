const webdriver = require('selenium-webdriver');
const child = require('child_process');
const fs = require('fs');

const chromium = require('./lib/chromium');
const sandbox = require('./lib/sandbox');
const log = require('lambda-log');

log.info('Loading function');

// Create new reusable session (spawns chromium and webdriver)
if (!process.env.CLEAN_SESSIONS) {
  $browser = chromium.createSession();
}

const parseScriptInput = (event) => {
  const inputParam = event.Base64Script || process.env.BASE64_SCRIPT;
  if (typeof inputParam !== 'string') {
    return null
  }

  return Buffer.from(inputParam, 'base64').toString('utf8');
}

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (process.env.CLEAN_SESSIONS) {
    log.info('attempting to clear /tmp directory')
    log.info(child.execSync('rm -rf /tmp/core*').toString());
  }

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
  
  // Creates a new session on each event (instead of reusing for performance benefits)
  if (process.env.CLEAN_SESSIONS) {
    $browser = chromium.createSession();
  }

  var opts = {
    browser: $browser,
    driver: webdriver
  };

  // Provide script: either a 1) selenium script or 2) a URL to visit
  var inputBuffer = parseScriptInput(event);
  if (inputBuffer !== null) {
    opts.scriptText = inputBuffer;
  } else if (event.pageUrl || process.env.PAGE_URL) {
    opts.pageUrl = event.pageUrl || process.env.PAGE_URL;
  }

  sandbox.executeScript(opts, function(err) {
    if (process.env.LOG_DEBUG) {
      log.debug(child.execSync('ps aux').toString());
      log.debug(child.execSync('cat /tmp/chromedriver.log').toString())
    }
    if (err) {
      return callback(err, null);
    }

    callback(null, 'Finished executing script');
  });
};
