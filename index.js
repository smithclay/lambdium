const webdriver = require('selenium-webdriver');
const child = require('child_process');
const fs = require('fs');

const chromium = require('./lib/chromium');
const { log } = require('./lib/helpers');

console.log('Loading function');

// callback accepts a URL to visit
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (process.env.DEBUG_ENV) {
    //log(child.execSync('set').toString());
    log(child.execSync('pwd').toString());
    log(child.execSync('ls -lhtra .').toString());
    log(child.execSync('ls -lhtra /tmp').toString());
  }

  log('Received event:', JSON.stringify(event, null, 2));
  
  const By = webdriver.By;
  const until = webdriver.until;
  $browser = chromium.createSession();
  $browser.get('http://www.google.com/ncr');
  //$browser.findElement(By.name('q')).sendKeys('webdriver');
  $browser.findElement(By.name('btnK')).click();
  $browser.wait(until.titleIs('Google'), 1000);
  $browser.takeScreenshot().then(function(data){
    console.log(data);
    var base64Data = data.replace(/^data:image\/png;base64,/,"")
    fs.writeFile("/tmp/out.png", base64Data, 'base64', function(err) {
      if (err) {
        console.log(err);
      }
      log(child.execSync('ps aux').toString());
      $browser.quit().then(function() {
        callback(null, event.key1);
      });
    });
  });
};
