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

variable "image_name" {
  type    = string
  default = "dev-centos8-image"
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
  machine_type        = "e2-small"
  image_name          = var.image_name
  service_account_email = "packer@csye6225-ankit-cloud-413805.iam.gserviceaccount.com"
}

build {
  sources = ["source.googlecompute.gmi"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "startnode.service"
    destination = "/tmp/startnode.service"
  }

  provisioner "shell" {
    scripts = [
      "./setup.sh",
      "./setupphase2.sh",
      "./ownership.sh",
      "./systemD.sh"
    ]
  }
}