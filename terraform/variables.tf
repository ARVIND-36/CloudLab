variable "subscription_id" {
  type        = string
  description = "Azure subscription id"
}

variable "location" {
  type        = string
  description = "Azure region"
  default     = "Central India"
}

variable "resource_group_name" {
  type    = string
  default = "cloudlab-rg"
}

variable "acr_name" {
  type    = string
  default = "cloudlabacr12345"
}

variable "aks_name" {
  type    = string
  default = "cloudlab-aks"
}

variable "postgres_server_name" {
  type    = string
  default = "cloudlabpostgres"
}

variable "postgres_database_name" {
  type    = string
  default = "cloudlab"
}

variable "postgres_admin_username" {
  type    = string
  default = "cloudlabadmin"
}