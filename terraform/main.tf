terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>4.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "7064f50c-78b3-4943-95b4-111baa62dc22"
}

resource "azurerm_resource_group" "cloudlab" {
  name     = "cloudlab-rg"
  location = "Central India"
}

resource "azurerm_virtual_network" "cloudlab" {
  name                = "cloudlab-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.cloudlab.location
  resource_group_name = azurerm_resource_group.cloudlab.name
}

resource "azurerm_subnet" "cloudlab" {
  name                 = "cloudlab-subnet"
  resource_group_name  = azurerm_resource_group.cloudlab.name
  virtual_network_name = azurerm_virtual_network.cloudlab.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "cloudlab" {
  name                = "cloudlab-pip"
  location            = azurerm_resource_group.cloudlab.location
  resource_group_name = azurerm_resource_group.cloudlab.name
  allocation_method   = "Static"
}

resource "azurerm_network_interface" "cloudlab" {
  name                = "cloudlab-nic"
  location            = azurerm_resource_group.cloudlab.location
  resource_group_name = azurerm_resource_group.cloudlab.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.cloudlab.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.cloudlab.id
  }
}