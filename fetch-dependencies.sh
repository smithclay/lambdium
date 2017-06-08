#!/bin/sh

npm install
mkdir -p bin

curl -SL https://github.com/adieuadieu/serverless-chrome/blob/master/chrome/chrome-headless-lambda-linux-x64.tar.gz\?raw\=true | tar xJv -C bin --strip-components 1

curl -SL https://chromedriver.storage.googleapis.com/2.30/chromedriver_linux64.zip > -d chromedriver.zip
unzip chromedriver.zip bin/
rm chromedriver.zip

