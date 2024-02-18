#!/bin/bash

sudo groupadd csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225 -m csye6225

cd /opt || exit
sudo unzip webapp.zip -d csye6225
sudo chmod o+rx /opt/csye6225
pwd
cd /opt/csye6225/webapp || exit
# cd webapp || exit
# sudo -u csye6225 bash
# cd ./csye6225/webapp || exit
sudo npm install

# sudo sh -c 'echo "DB_PORT=5432" >> /opt/csye6225/webapp/.env'
# sudo sh -c 'echo "APP_PORT=6225" >> /opt/csye6225/webapp/.env'
# sudo sh -c 'echo "DB_HOSTNAME=localhost" >> /opt/csye6225/webapp/.env'
# sudo sh -c 'echo "DB_PASSWORD=postgres" >> /opt/csye6225/webapp/.env'
# sudo sh -c 'echo "DB_USER=postgres" >> /opt/csye6225/webapp/.env'
# sudo sh -c 'echo "DB_NAME=postgres" >> /opt/csye6225/webapp/.env'
# sudo sh -c 'echo "DB_DIALECT=postgres" >> /opt/csye6225/webapp/.env'

