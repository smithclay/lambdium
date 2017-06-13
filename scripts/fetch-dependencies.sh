#!/bin/sh

# Install dependencies
npm install
mkdir -p bin

if ! [ -x "$(command -v modclean)" ]; then
  echo 'Error: modclean is not installed. To install: npm -g modclean' >&2
  exit 1
fi

# Reduce size of node_modules directory
modclean --patterns="default:*"

# Get headless shell
curl -SL https://github.com/adieuadieu/serverless-chrome/blob/master/chrome/chrome-headless-lambda-linux-x64.tar.gz\?raw\=true | tar xJv -C bin --strip-components 1

# Get Chromedriver
curl -SL https://chromedriver.storage.googleapis.com/2.30/chromedriver_linux64.zip > chromedriver.zip
unzip chromedriver.zip -d bin/
rm chromedriver.zip
