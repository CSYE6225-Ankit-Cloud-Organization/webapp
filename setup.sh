#!/bin/bash

# Copy the zip to current working directory
sudo whoami
sudo mv /tmp/webapp.zip /opt/webapp.zip
echo "webapp copy completed"
sudo mv /tmp/startnode.service /etc/systemd/system/startnode.service
echo "systemd file copy completed"
# Create the log folder
sudo mkdir -p /var/log/webapp

# Install important packages
sudo dnf update -y
sudo dnf module install nodejs:20 -y
sudo dnf install npm -y
sudo dnf install unzip -y
sudo dnf remove git -y
# sudo dnf install postgresql-server -y
# sudo dnf install postgresql-contrib -y
echo "packages are updated"

# Installing Ops Agent
echo "Installing Ops Agent"
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
sudo systemctl enable google-cloud-ops-agent
sudo mv /tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml
echo "ops agent config file copy completed"
sudo systemctl restart google-cloud-ops-agent
echo "Ops Agent Installed"


# Setup PostgreSQL
# sudo postgresql-setup initdb
# sudo systemctl start postgresql
# sudo systemctl stop postgresql
# sudo sed -i -E '/^host\s+all\s+all\s+(127\.0\.0\.1\/32|::1\/128)\s+ident$/ s/ident/md5/' /var/lib/pgsql/data/pg_hba.conf
# sudo systemctl enable postgresql
# sudo systemctl start postgresql
# sudo systemctl status postgresql
# echo "postgres service is setup succesfully"

#Setup the Postgres db
# username=$DB_USERNAME
# password=$DB_PASSWORD
# sudo -i -u postgres psql -c "ALTER USER $username WITH PASSWORD '$password';"
# echo "postgres db commands executed successfully"
