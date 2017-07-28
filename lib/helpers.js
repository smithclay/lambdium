const net = require('net');
const child = require('child_process');

exports.log = function() {
  console.log.apply(this, arguments);
};

exports.spawnLocalProcess = function(localPath, flags) {
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
