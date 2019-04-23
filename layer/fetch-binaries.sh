#!/bin/sh

mkdir -p bin

# Get headless shell
curl -SL https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-35/stable-headless-chromium-amazonlinux-2017-03.zip > chromeheadless.zip
unzip chromeheadless.zip -d bin/
rm chromeheadless.zip

# Get Chromedriver
curl -SL https://chromedriver.storage.googleapis.com/2.35/chromedriver_linux64.zip> chromedriver.zip
unzip chromedriver.zip -d bin/
rm chromedriver.zip
