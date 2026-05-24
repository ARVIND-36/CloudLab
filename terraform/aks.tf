resource "azurerm_kubernetes_cluster" "cloudlab" {
  name                = "cloudlab-aks"
  location            = azurerm_resource_group.cloudlab.location
  resource_group_name = azurerm_resource_group.cloudlab.name
  dns_prefix          = "cloudlab"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2s_v3"
  }

  identity {
    type = "SystemAssigned"
  }
}