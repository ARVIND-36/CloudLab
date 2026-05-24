output "acr_login_server" {
  value = azurerm_container_registry.cloudlab.login_server
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.cloudlab.name
}

output "postgres_host" {
  value = azurerm_postgresql_flexible_server.cloudlab.fqdn
}

output "postgres_connection_string" {
  value     = "postgresql://${var.postgres_admin_username}:${random_password.postgres.result}@${azurerm_postgresql_flexible_server.cloudlab.fqdn}:5432/${var.postgres_database_name}?sslmode=require"
  sensitive = true
}

output "postgres_password" {
  value     = random_password.postgres.result
  sensitive = true
}