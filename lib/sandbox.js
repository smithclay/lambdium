const vm = require('vm');
const log = require('lambda-log');

exports.executeScript = function(opts = {}, cb) {
  const browser = opts.browser;
  const driver = opts.driver;
  var scriptText = opts.scriptText;

  // Just visit a web page if a script isn't specified
  if (opts.pageUrl && (typeof scriptText !== 'string')) {
    scriptText = `$browser.get('${opts.pageUrl}').then(function(){ $browser.close() });`;
  }
  log.debug(`Executing script "${scriptText}"`);

  if (typeof scriptText !== 'string') {
    return cb('Error: no url or script found to execute.');
  }

  // Create Sandbox VM
  const sandbox = {
    '$browser': browser,
    '$driver': driver,
    'console': console
  };

  const script = new vm.Script(opts.scriptText);
  // TODO: Set timeout options for VM context
  const scriptContext = new vm.createContext(sandbox);
  try {
    script.runInContext(scriptContext);
  } catch (e) {
    log.error(`[script error] ${e}`);
    return cb(e, null);
  } 

  // https://github.com/GoogleChrome/puppeteer/issues/1825#issuecomment-372241101
  // Reuse existing session, likely some edge cases around this...
  if (process.env.CLEAN_SESSIONS) {
    browser.quit().then(function() {
      cb(null);
    });
  } else {
    browser.manage().deleteAllCookies().then(function() {
      return browser.get('about:blank').then(function() {
        cb(null);
      });
    }).catch(function(err) {
      cb(err);
    });
  }
}
