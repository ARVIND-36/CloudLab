resource "azurerm_network_security_group" "cloudlab" {
  name                = "cloudlab-nsg"
  location            = azurerm_resource_group.cloudlab.location
  resource_group_name = azurerm_resource_group.cloudlab.name

  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
  security_rule {
  name                       = "HTTP"
  priority                   = 1002
  direction                  = "Inbound"
  access                     = "Allow"
  protocol                   = "Tcp"
  source_port_range          = "*"
  destination_port_range     = "80"
  source_address_prefix      = "*"
  destination_address_prefix = "*"
}
}

resource "azurerm_network_interface_security_group_association" "cloudlab" {
  network_interface_id      = azurerm_network_interface.cloudlab.id
  network_security_group_id = azurerm_network_security_group.cloudlab.id
}

resource "azurerm_linux_virtual_machine" "cloudlab" {
  name                = "cloudlab-vm"
  resource_group_name = azurerm_resource_group.cloudlab.name
  location            = azurerm_resource_group.cloudlab.location
  size = "Standard_D2s_v3"
  admin_username      = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.cloudlab.id,
  ]

  admin_ssh_key {
    username   = "azureuser"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDnT+Ku9k7huxZ9pVwj50IOQ82xvJV91I/94qCU7mJ9Sk/mjihoErgTdyu9Mn3epdbGLldKX4/Pq+PmXOpZKYqMBLBC7PfccjYYFnEIfX03eu4eKm1Zcx2CvmqDke0Fj8OZBuQzMtohr2PBJ1DcKgyBu993PAGWenSXKv3+q+byAfKGdMAVwi77JdR1SZJRGYWCff0II4+CiCZtduTjqEgxlygpSOA7RA8rQuFE6/n7nHXf6HTrGfWADWan0kC9tVVcS5Vwx3OdqP8zPBGrofnkEWaqWxzVsMvzFOUt+4lOD8O+pNgfXVwfhHvuIV9U+Yix/ZLqENFnwbQn1dB8g1bQ2yazAcYFDS4pB4ai+/Njd3IC4EkKhkUoROB/bsJf3i5DZf0Eo/4oM6RoLYCgBsdaFsLYPqqugDGvx8nEqYv4v+LVBFdudeyimaf+k0LPA98TDNbPd8bZr62sRHUMEuLeTgYoiiqzuyB/Vve+R1JY1bkVDyr/jyTViNl86SF1BHMGOopFAOhCG8S6EEdRxNT9Kw71RUJt3G00rTaXOD39KZFLfLMZFIkiFA4oGvyxqGQYy0YlEqoYSAItVOyd13HeRz89wV7MsI7OEK+Pwvvc82LULGxz7BgFQJfLiaMSuccoBAgLxE6UbVGpwd+gmGgmyTu0eQUG79xUw3nBN4O4LQ== pnarv@Ar"
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }
}