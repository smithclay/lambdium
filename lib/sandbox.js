const vm = require('vm');
const log = require('lambda-log');

exports.executeScript = function(scriptText, browser, driver, cb) {
  // Create Sandbox VM
  const sandbox = {
    '$browser': browser,
    '$driver': driver,
    'console': console
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

  /*
  // Print performance logs
  $browser.manage().logs().get('performance').then(function (log) {
      for (var index in log) {
        var entry = log[index];
        console.log("[script-log] [" + entry.level.name + "] " + entry.message);
      }
  });
  */
  // https://github.com/GoogleChrome/puppeteer/issues/1825#issuecomment-372241101
  // Reuse existing session, likely some edge cases around this...
  browser.manage().deleteAllCookies().then(function() {
    return $browser.get('about:blank').then(function() {
      cb(null);
    }).catch(function(err) {
      cb(err);
    });
  });
}