#!/bin/bash

cd /home/ec2-user/DatingApp

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  #ucitavanje nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 

nvm use v16

npm ci

node app.js > app.out.js 2> app.err.log < /dev/null &