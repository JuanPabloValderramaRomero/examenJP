import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
  final String username;
  final String role;
  final Function(int) onItemSelected;
  final VoidCallback onLogout;
  final int currentIndex;

  const CustomDrawer({
    super.key,
    required this.username,
    required this.role,
    required this.onItemSelected,
    required this.onLogout,
    required this.currentIndex,
  });

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [_buildHeader(context), _buildMenuItems(context)],
      ), // ListView
    ); // Drawer
  }

  Widget _buildHeader(BuildContext context) {
    return DrawerHeader(
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).primaryColor,
            Theme.of(context).primaryColor.withAlpha((0.8 * 255).round()),
          ],
        ), // LinearGradient
      ), // BoxDecoration
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const CircleAvatar(
            radius: 30,
            backgroundColor: Colors.white,
            child: Icon(Icons.person, size: 40, color: Colors.blue), // Icon
          ), // CircleAvatar
          const SizedBox(height: 15),
          Text(
            username,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ), // TextStyle
          ), // Text
          const SizedBox(height: 4),
          Text(
            'Rol: $role',
            style: TextStyle(
              color: Colors.white.withAlpha((0.8 * 255).round()),
              fontSize: 14,
            ),
          ),
        ], // Text
      ), // Column
    ); // DrawerHeader
  }

  Widget _buildMenuItems(BuildContext context) {
    return Column(
      children: [
        _buildListTile(context, Icons.home, 'Inicio', 0, currentIndex == 0),
        _buildListTile(
          context,
          Icons.person,
          'Mi Perfil',
          1,
          currentIndex == 1,
        ),
        _buildListTile(
          context,
          Icons.settings,
          'Configuración',
          2,
          currentIndex == 2,
        ),
        const Divider(),
        _buildListTile(
          context,
          Icons.notifications,
          'Notificaciones',
          3,
          false,
        ),
        _buildListTile(context, Icons.help, 'Ayuda', 4, false),
        _buildListTile(context, Icons.info, 'Acerca de', 5, false),
        const Divider(),
        _buildLogoutTile(context),
      ], // Column
    );
  }

  Widget _buildListTile(
    BuildContext context,
    IconData icon,
    String title,
    int index,
    bool isSelected,
  ) {
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? Theme.of(context).primaryColor : Colors.grey[700],
      ), // Icon
      title: Text(
        title,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? Theme.of(context).primaryColor : Colors.black87,
        ), // TextStyle
      ), // Text
      trailing: isSelected
          ? Icon(
              Icons.arrow_forward,
              color: Theme.of(context).primaryColor,
              size: 20,
            ) // Icon
          : null,
      onTap: () => onItemSelected(index),
      selected: isSelected,
      selectedTileColor: Theme.of(
        context,
      ).primaryColor.withAlpha((0.1 * 255).round()),
    ); // ListTile
  }

  Widget _buildLogoutTile(BuildContext context) {
    return ListTile(
      leading: const Icon(Icons.logout, color: Colors.red),
      title: const Text(
        'Cerrar Sesión',
        style: TextStyle(color: Colors.red),
      ), // Text
      onTap: () {
        Navigator.pop(context); // Cerrar el drawer
        onLogout();
      },
    ); // ListTile
  }
}
