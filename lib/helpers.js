const net = require('net');
const child = require('child_process');

exports.log = function() {
  console.log.apply(this, arguments);
};

exports.waitForPort = function(port, cb) {
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
