const vm = require('vm');
const log = require('lambda-log');

exports.executeScript = function(opts = {}, cb) {
  const browser = opts.browser;
  const driver = opts.driver;
  var scriptText = opts.scriptText;

  // Just visit a web page if a script isn't specified
  if (opts.pageUrl && scriptText === undefined) {
    scriptText = require('fs').readFileSync(require('path').join(__dirname, 'visit-page.js'), 'utf8').toString();
  }
  log.info(`Executing script "${scriptText}"`);

  if (typeof scriptText !== 'string') {
    return cb('Error: no url or script found to execute.');
  }

  var consoleWrapper = {
    log: function(){
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[lambdium-selenium]');
      console.log.apply(console, args);
    }
  };

  // Create Sandbox VM
  const sandbox = {
    '$browser': browser,
    '$driver': driver,
    '$pageUrl': opts.pageUrl,
    'console': consoleWrapper
  };

  const script = new vm.Script(scriptText);
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
