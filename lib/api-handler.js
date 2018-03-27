const busboy = require('busboy');
const path = require('path');
const os = require('os');

const sandbox = require('./sandbox');

module.exports = function(event, context, callback) {
    $browser = sandbox.initBrowser(event, context);
    var errorMessage = '';
    const response = {
      statusCode: 200,
      headers: {
          "Content-Type": 'application/text',
          "X-Error": errorMessage || null
      },
      body: '',
      isBase64Encoded: false
    };
    var body = event.body;
    if (event.isBase64Encoded) {
      body = Buffer.from(event.body, 'base64').toString('utf8');
    }
    var scriptFile = new Buffer(0)
    

    const SCRIPT_FIELDNAME = 'script';
  
    var contentType = event.headers['Content-Type'] || event.headers['content-type'];
    var bb = new busboy({ headers: { 'content-type': contentType }});
    var result = {};
    bb.on('file', function (fieldname, file, filename, encoding, mimetype) {
      file.on('data', data => {
        result.file = data;
      });
  
      file.on('end', () => {
        result.filename = filename;
        result.contentType = mimetype;
      });
    })
    .on('finish', () => {
  
      // Execute uploaded script
      var scriptText = result.file.toString();
      var opts = sandbox.buildOptions(event, $browser);
      opts.scriptText = scriptText;
      
      sandbox.executeScript(opts, function(err, output) {
        if (err) {
          response.headers['X-Error'] = err;
          response.body = err;
          response.statusCode = 500;
          return callback(null, response);
        }
        response.body = output;
        callback(null, response);
      });
    })
    .on('error', err => {
      response.headers['X-Error'] = err;
      response.body = err;
      response.statusCode = 500;
      callback(null, response);
    });
  
    bb.end(body);
  };