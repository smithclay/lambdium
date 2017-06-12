const net = require('net');
const child = require('child_process');

exports.log = function() {
  console.log.apply(this, arguments);
};
