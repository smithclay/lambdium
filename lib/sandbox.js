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
  $browser.quit().then(function() {
    cb(null);
  });
}