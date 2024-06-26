#!/bin/bash

sudo groupadd csye6225
sudo useradd -s /usr/sbin/nologin -g csye6225 -d /opt/csye6225 -m csye6225

cd /opt || exit
sudo unzip webapp.zip -d csye6225
sudo -u csye6225 bash -c "cd /opt/csye6225 && npm install && rm -rf .git && exit"
pwd
sudo rm -rf /opt/webapp.zip

# Set the permissions for the log folder
sudo chown -R csye6225:csye6225 /var/log/webapp
sudo chmod -R 744 /var/log/webapp