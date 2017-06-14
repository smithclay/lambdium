// Interact with a React SPA app.
// This uses the selenium-webdriver 3.4 package.
// Docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html

$browser.get('https://d3q2ykjqmzt1zl.cloudfront.net/').then(function(){
  return $browser.findElement($driver.By.id('play-race')).then(function(element){
    return element.click().then(function(){
      $browser.wait(function() {
        return $driver.until.elementLocated($driver.By.xpath("//*[contains(text(),'#1')]"));
      }, 10000).then(function() {
        console.log('Race finished!');
        $browser.close();
      });
    });
  });
});