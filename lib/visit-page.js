// This is the default lambdium webdriver script: it just visits a page url.
console.log($pageUrl);
$browser.get($pageUrl).then(function() {
    console.log('visited page', $pageUrl);
}).catch(function() {
    console.log('error visiting page', $pageUrl);
});
