const webdriver = require('selenium-webdriver');
const child = require('child_process');
const fs = require('fs');

const chromium = require('./lib/chromium');
const sandbox = require('./lib/sandbox');
const { log } = require('./lib/helpers');

console.log('Loading function');

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (process.env.DEBUG_ENV) {
    //log(child.execSync('set').toString());
    log(child.execSync('pwd').toString());
    log(child.execSync('ls -lhtra .').toString());
    log(child.execSync('ls -lhtra /tmp').toString());
  }

  log('Received event:', JSON.stringify(event, null, 2));
  
  const $driver = webdriver;
  $browser = chromium.createSession();

  const text =
    `
      console.log('About to visit google.com...');
      $browser.get('http://www.google.com/ncr');
      //$browser.findElement(By.name('q')).sendKeys('webdriver');
      $browser.findElement($driver.By.name('btnK')).click();
      $browser.wait($driver.until.titleIs('Google'), 1000);
      console.log('Finished running script!');
    `;

   sandbox.executeScript(text, $browser, webdriver, function(err) {
    if (process.env.DEBUG_ENV) {
      log(child.execSync('ps aux').toString());
    }

    if (err) {
      callback(err, null);
    }

    callback(null, 'Finished executing script');
   });
};
