#!/bin/bash

# node i npm download
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash . ~/.nvm/nvm.sh
nvm install node

#kreiranje foldera
DIR="home/ec2-user/DatingApp"
if [ -d "${DIR}" ]; then
   echo "${DIR} Postoji"
else 
echo "Kraira se ${DIR} Direktorij"
fi 