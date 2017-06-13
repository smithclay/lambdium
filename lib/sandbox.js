const vm = require('vm');

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
    console.log('[script-error]', e);
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

  $browser.quit().then(function() {
    cb(null);
  });
}