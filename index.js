const CDP = require('chrome-remote-interface');
const child = require('child_process');
const chromium = require('lib/chromium');

const { log, waitForPort } = require('lib/helpers');

console.log('Loading function');

const CHROME_REMOTE_DEBUGGING_PORT = 9222;
const LOCALHOST = '127.0.0.1';

// Start headless chromium process
chromium.start();

// callback accepts a URL to visit
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (process.env.DEBUG_ENV) {
    log(child.execSync('set').toString());
    log(child.execSync('pwd').toString());
    log(child.execSync('ls -lhtra .').toString());
    log(child.execSync('ls -lhtra /tmp').toString());
  }

  log('Received event:', JSON.stringify(event, null, 2));
  
  // Wait for port 9222 to be available so we can connect to chromium.
  waitForPort(CHROME_REMOTE_DEBUGGING_PORT, function() {
    log('[socket] connection established.');

    CDP.List(function (err, targets) {
      if (err) {
        log('[chrome-remote]', log);
        return callback(err);
      }
      log('[chrome-remote] targets', JSON.stringify(targets));

      const firstTab = targets[0];
      CDP({host: LOCALHOST, target: firstTab}, (client) => {
          // extract domains
          const {Network, Page} = client;
          // setup handlers
          var pendingRequests = 0;
          var loadEventFired = false;
          Network.requestWillBeSent((params) => {
            log('[chrome-remote]', params.request.url);
            pendingRequests = pendingRequests + 1;
          });
          Network.responseReceived((params) => {
            pendingRequests--;
          });
          Page.loadEventFired(() => {
            loadEventFired = true;
          });

          // enable events then start!
          Promise.all([
            Network.enable(),
            Page.enable()
          ]).then(() => {
            return Page.navigate({url: 'https://clay.fyi'});
          }).catch((err) => {
            log('[chrome-remote]', err);
            client.close();
          });

          // Polling loop waiting for no network activity and loadEvent
          setInterval(() => {
            log('[chrome-remote] pendingRequests', pendingRequests);

            if (pendingRequests === 0 && loadEventFired) {
              client.close();
              callback(null, event.key1);
            }
          }, 500);
      }).on('error', (err) => {
          // cannot connect to the remote endpoint
          console.error(err);
      });
    });
  });
};
