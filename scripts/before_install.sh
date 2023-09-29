#!/bin/bash
sudo yum update -y

# node i npm download


sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

. ~/.nvm/nvm.sh

nvm install node

#kreiranje foldera
DIR="home/ec2-user/DatingApp"
if [ -d "${DIR}" ]; then
   echo "${DIR} Postoji"
else 
echo "Kraira se ${DIR} Direktorij"
fi 