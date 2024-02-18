#!/bin/bash

echo "Enabling the REST API Service"
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