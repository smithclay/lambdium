const child = require('child_process');
const { log } = require('./helpers');
const os = require('os');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const webdriver = require('selenium-webdriver');

const CHROME_REMOTE_DEBUGGING_PORT = 9222;

const defaultChromeFlags = [
  '--headless', // Redundant?
  //`--remote-debugging-port=${CHROME_REMOTE_DEBUGGING_PORT}`,

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

const HEADLESS_CHROME_PATH = 'bin/headless_shell';

exports.createSession = function() {
  const service = new chrome.ServiceBuilder()
    .enableVerboseLogging()
    .build();

  const options = new chrome.Options();

  const logPrefs = new webdriver.logging.Preferences();
  logPrefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.ALL);
  options.setLoggingPrefs(logPrefs);

  options.setPerfLoggingPrefs({ enableNetwork: true, enablePage: true });
  options.setChromeBinaryPath(path.join(process.env.LAMBDA_TASK_ROOT, HEADLESS_CHROME_PATH));
  options.addArguments(defaultChromeFlags);
  return chrome.Driver.createSession(options, service);
}

const spawnProcess = function(localPath, flags) {
  const opts = {
      cwd: os.tmpdir(),
      shell: true,
      detached: true,
  };

  const proc = child.spawn(path.join(process.env.LAMBDA_TASK_ROOT, localPath), 
    flags,
    opts
  );
  return proc; 
};
