const child = require('child_process');
const os = require('os');
const path = require('path');
const CDP = require('chrome-remote-interface');

console.log('Loading function');

const CHROME_REMOTE_DEBUGGING_PORT = 9222;
const LOCALHOST = '127.0.0.1';

const defaultChromeFlags = [
  '--headless', // Redundant?
  `--remote-debugging-port=${CHROME_REMOTE_DEBUGGING_PORT}`,

  '--disable-gpu', // TODO: should we do this?
  '--window-size=1280x1696', // Letter size
  '--no-sandbox',
  '--user-data-dir=/tmp/user-data',
  '--hide-scrollbars',
  '--enable-logging',
  '--log-level=0',
  '--v=99',
  '--single-process',
  '--data-path=/tmp/data-path',

  '--ignore-certificate-errors', // Dangerous?

  // '--no-zygote', // Disables the use of a zygote process for forking child processes. Instead, child processes will be forked and exec'd directly. Note that --no-sandbox should also be used together with this flag because the sandbox needs the zygote to work.

  '--homedir=/tmp',
  // '--media-cache-size=0',
  // '--disable-lru-snapshot-cache',
  // '--disable-setuid-sandbox',
  // '--disk-cache-size=0',
  '--disk-cache-dir=/tmp/cache-dir',

  // '--use-simple-cache-backend',
  // '--enable-low-end-device-mode',

  // '--trace-startup=*,disabled-by-default-memory-infra',
  //'--trace-startup=*',
];

// TODO:
// Metrics collection:
// -- memory usage (how many sessions can we open?)
// -- startup latency

const log = function() {
  console.log.apply(this, arguments);
};

const spawnLocalProcess = function(localPath) {
  const opts = {
      cwd: os.tmpdir(),
      shell: true,
      detached: true,
  };

  const proc = child.spawn(path.join(process.env.LAMBDA_TASK_ROOT, localPath), 
    defaultChromeFlags,
    opts
  );
  return proc; 
};

const waitForPort = function(port, cb) {
  var net = require('net');

  var interval = setInterval(function() {
    var socket = net.createConnection(port, '127.0.0.1', function(err) {
      if (err) {
        log(`[socket] ${err}`);
        return;
      }

      if (socket) {
        socket.destroy();
      }
      clearInterval(interval);
      cb(null);
    });
  }, 1000);
}

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
  
  // Wait for port 9222 to be available
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
          Network.requestWillBeSent((params) => {
              log('[chrome-remote]', params.request.url);
          });
          Page.loadEventFired(() => {
              client.close();
              callback(null, event.key1);
          });
          // enable events then start!
          Promise.all([
              Network.enable(),
              Page.enable()
          ]).then(() => {
              return Page.navigate({url: 'https://github.com'});
          }).catch((err) => {
              log('[chrome-remote]', err);
              client.close();
          });
      }).on('error', (err) => {
          // cannot connect to the remote endpoint
          console.error(err);
      });
    });
  });

  const proc = spawnLocalProcess('bin/headless_shell');
  proc.on('error', function (err) {
    log('[chrome] error: %s', err)
    process.exit(1);
  })

  proc.on('exit', function (code, signal) {
    log('[chrome] exit: code=%s signal=%s', code, signal)
    process.exit(1);
  });

  proc.stderr.on('data', function (line) {
    log('[chrome] `%s`', line)
  });

  proc.stdout.on('data', function (line) {
    log('[chrome] `%s`', line)
  });

  if (process.env.DEBUG_ENV) {
    log(child.execSync('ps lx').toString());
  }
};
