#!/bin/bash

echo "Enabling npm start service"
sudo systemctl daemon-reload
sudo systemctl enable startnode
sudo systemctl start startnode
sudo systemctl status startnode
APISRVC=$?

if [ $APISRVC -eq 0 ]; then
  echo "success"
else
  echo "fail"
fi