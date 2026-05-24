terraform {
  required_version = ">= 1.7.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

resource "random_password" "postgres" {
  length  = 24
  special = true
}

resource "azurerm_resource_group" "cloudlab" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "cloudlab" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.cloudlab.name
  location            = azurerm_resource_group.cloudlab.location
  sku                 = "Standard"
  admin_enabled       = true
}

resource "azurerm_virtual_network" "cloudlab" {
  name                = "cloudlab-vnet"
  address_space       = ["10.10.0.0/16"]
  location            = azurerm_resource_group.cloudlab.location
  resource_group_name = azurerm_resource_group.cloudlab.name
}

resource "azurerm_subnet" "aks" {
  name                 = "cloudlab-aks-subnet"
  resource_group_name  = azurerm_resource_group.cloudlab.name
  virtual_network_name = azurerm_virtual_network.cloudlab.name
  address_prefixes     = ["10.10.1.0/24"]
}

resource "azurerm_subnet" "postgres" {
  name                 = "cloudlab-postgres-subnet"
  resource_group_name  = azurerm_resource_group.cloudlab.name
  virtual_network_name = azurerm_virtual_network.cloudlab.name
  address_prefixes     = ["10.10.2.0/24"]

  delegation {
    name = "postgres-flexible-server"

    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

resource "azurerm_private_dns_zone" "postgres" {
  name                = "${var.postgres_server_name}.private.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.cloudlab.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgres" {
  name                  = "cloudlab-postgres-vnet-link"
  private_dns_zone_name = azurerm_private_dns_zone.postgres.name
  virtual_network_id    = azurerm_virtual_network.cloudlab.id
  resource_group_name   = azurerm_resource_group.cloudlab.name
}

resource "azurerm_postgresql_flexible_server" "cloudlab" {
  name                          = var.postgres_server_name
  resource_group_name           = azurerm_resource_group.cloudlab.name
  location                      = azurerm_resource_group.cloudlab.location
  version                       = "16"
  delegated_subnet_id           = azurerm_subnet.postgres.id
  private_dns_zone_id           = azurerm_private_dns_zone.postgres.id
  administrator_login           = var.postgres_admin_username
  administrator_password        = random_password.postgres.result
  zone                          = "1"
  storage_mb                    = 32768
  sku_name                      = "B_Standard_B1ms"
  public_network_access_enabled = false

  depends_on = [azurerm_private_dns_zone_virtual_network_link.postgres]
}

resource "azurerm_postgresql_flexible_server_database" "cloudlab" {
  name      = var.postgres_database_name
  server_id = azurerm_postgresql_flexible_server.cloudlab.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}