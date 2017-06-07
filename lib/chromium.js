const child = require('child_process');
const { log } = require('./helpers');
const os = require('os');
const path = require('path');

const HEADLESS_CHROME_PATH = 'bin/headless_shell';
const CHROME_REMOTE_DEBUGGING_PORT = 9222;

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

const spawnChrome = function(localPath) {
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

exports.start = function() {
    const proc = spawnChrome(HEADLESS_CHROME_PATH);
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
