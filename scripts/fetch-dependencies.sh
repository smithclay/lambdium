#!/bin/sh

# Install dependencies
npm install
mkdir -p bin

if ! [ -x "$(command -v modclean)" ]; then
  echo 'Error: modclean is not installed. To install: npm i -g modclean' >&2
  exit 1
fi

# Reduce size of node_modules directory
modclean --patterns="default:*"

# Get headless shell
curl -SL https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-35/stable-headless-chromium-amazonlinux-2017-03.zip > chromeheadless.zip
unzip chromeheadless.zip -d bin/
rm chromeheadless.zip

# Get Chromedriver
curl -SL https://chromedriver.storage.googleapis.com/2.35/chromedriver_linux64.zip> chromedriver.zip
unzip chromedriver.zip -d bin/
rm chromedriver.zip
