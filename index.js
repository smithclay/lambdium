
const chromium = require('./lib/chromium');
const sandbox = require('./lib/sandbox');
const log = require('lambda-log');
const apiHandler = require('./lib/api-handler');

if (process.env.DEBUG_ENV || process.env.SAM_LOCAL) {
  log.config.debug = true;
  log.config.dev = true;
}

log.info('Loading function');

// Create new reusable session (spawns chromium and webdriver)
if (!process.env.CLEAN_SESSIONS) {
  $browser = chromium.createSession();
}

// Handler for POST events from API gateway
exports.postApiGatewayHandler = apiHandler;

// Default function event handler
// Accepts events:
// * {"Base64Script": "<<encoded selenium script>>"}
// * {"pageUrl": "<<URI to visit>>"}
// Accepts environment variables:
// * BASE64_SCRIPT: encoded selenium script
// * PAGE_URL: URI to visit
exports.handler = (event, context, callback) => {
  $browser = sandbox.initBrowser(event, context);

  var opts = sandbox.buildOptions(event, $browser);

  sandbox.executeScript(opts, function(err) {
    if (process.env.LOG_DEBUG) {
      log.debug(child.execSync('ps aux').toString());
      log.debug(child.execSync('cat /tmp/chromedriver.log').toString())
    }
    if (err) {
      log.error(err);
      return callback(err, null);
    }

    callback(null, 'Finished executing script');
  });
};
