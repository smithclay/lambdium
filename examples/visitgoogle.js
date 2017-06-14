// Sample selenimum-webdriver script that visits google.com
// This uses the selenium-webdriver 3.4 package.
// Docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html
// $browser = webdriver session
// $driver = driver libraries
// console.log will output to AWS Lambda logs (via Cloudwatch)

console.log('About to visit google.com...');
$browser.get('http://www.google.com/ncr');
$browser.findElement($driver.By.name('btnK')).click();
$browser.wait($driver.until.titleIs('Google'), 1000);
$browser.getTitle().then(function(title) {
    console.log("title is: " + title);
});
console.log('Finished running script!');