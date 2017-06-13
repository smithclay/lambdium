// Sample selenimum-webdriver script
// $browser = webdriver session
// $driver = driver libraries
// console.log will output to AWS Cloudwatch logs

console.log('About to visit google.com...');
$browser.get('http://www.google.com/ncr');
$browser.findElement($driver.By.name('btnK')).click();
$browser.wait($driver.until.titleIs('Google'), 1000);
$browser.getTitle().then(function(title) {
    console.log("title is: " + title);
});
console.log('Finished running script!');