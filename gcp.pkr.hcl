variable "project_id" {
  type    = string
  default = "csye6225-ankit-cloud-413805"
}

variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "zone" {
  type    = string
  default = "us-central1-a"
}

variable "ssh_username" {
  type    = string
  default = "packer"
}

variable "image_description" {
  type    = string
  default = "Custom CentOS 8 image with webapp and services installed"
}

variable "machine_type" {
  type    = string
  default = "e2-medium"
}

variable "webapp_source" {
  type    = string
  default = "webapp.zip"
}

variable "startnode_source" {
  type    = string
  default = "startnode.service"
}

variable "opsagent_config_source" {
  type    = string
  default = "config.yaml"
}

variable "webapp_destination" {
  type    = string
  default = "/tmp/webapp.zip"
}

variable "startnode_destination" {
  type    = string
  default = "/tmp/startnode.service"
}

variable "opsagent_config_destination" {
  type    = string
  default = "/tmp/config.yaml"
}

variable "setup_scripts" {
  type    = list(string)
  default = ["./setup.sh", "./setupphase2.sh", "./ownership.sh", "./systemD.sh"]
}

variable "db_username" {
  type    = string
  default = "postgres"
}
variable "db_password" {
  type    = string
  default = "postgres"
}


packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0, < 2.0.0"
    }
  }
}

source "googlecompute" "gmi" {
  project_id          = var.project_id
  source_image_family = var.source_image_family
  zone                = var.zone
  ssh_username        = var.ssh_username
  machine_type        = var.machine_type
  image_description   = var.image_description
}

build {
  sources = ["source.googlecompute.gmi"]

  provisioner "file" {
    source      = var.webapp_source
    destination = var.webapp_destination
  }

  provisioner "file" {
    source      = var.startnode_source
    destination = var.startnode_destination
  }

  provisioner "file" {
    source      = var.opsagent_config_source
    destination = var.opsagent_config_destination
  }

  provisioner "shell" {
    scripts = var.setup_scripts
    // environment_vars = [
    //   "DB_USERNAME=${var.db_username}",
    //   "DB_PASSWORD=${var.db_password}",
    // ]
  }
}