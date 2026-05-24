resource "azurerm_kubernetes_cluster" "cloudlab" {
  name                = var.aks_name
  location            = azurerm_resource_group.cloudlab.location
  resource_group_name = azurerm_resource_group.cloudlab.name
  dns_prefix          = "cloudlab"

  default_node_pool {
    name           = "default"
    node_count     = 2
    vm_size        = "Standard_D2s_v3"
    vnet_subnet_id = azurerm_subnet.aks.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
    outbound_type  = "loadBalancer"
  }

  role_based_access_control_enabled = true
  local_account_disabled            = false

  depends_on = [azurerm_container_registry.cloudlab]
}

resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.cloudlab.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.cloudlab.kubelet_identity[0].object_id
}