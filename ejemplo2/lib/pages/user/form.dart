import 'package:flutter/material.dart';
import '../../widgets/appbar.dart';
import '../../models/role.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../services/role_service.dart';

class UserFormScreen extends StatefulWidget {
  const UserFormScreen({super.key});

  @override
  State<UserFormScreen> createState() => _UserFormScreenState();
}

class _UserFormScreenState extends State<UserFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  late final ApiClient _apiClient;
  late final AuthService _authService;
  late final RoleService _roleService;

  bool _loadingRoles = false;
  String? _rolesError;
  List<Role> _roles = const [];
  Role? _selectedRole;

  @override
  void initState() {
    super.initState();
    _apiClient = ApiClient();
    _authService = AuthService(_apiClient);
    _roleService = RoleService(_apiClient);
    _loadRoles();
  }

  Future<void> _loadRoles() async {
    setState(() {
      _loadingRoles = true;
      _rolesError = null;
    });

    try {
      final roles = await _roleService.getRoles();
      Role? selected = _selectedRole;

      if (roles.isNotEmpty) {
        Role? preferred;
        for (final name in ['client', 'usuario']) {
          for (final role in roles) {
            if (role.name.toLowerCase() == name) {
              preferred = role;
              break;
            }
          }
          if (preferred != null) break;
        }

        selected = preferred ?? roles.first;
      }

      if (!mounted) return;
      setState(() {
        _roles = roles;
        _selectedRole = selected;
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      setState(() {
        _rolesError = e.toString();
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _rolesError = 'Error inesperado: $e';
      });
    } finally {
      if (!mounted) return;
      setState(() {
        _loadingRoles = false;
      });
    }
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Las contrasenas no coinciden')),
      );
      return;
    }

    try {
      final role = _selectedRole?.name.trim();
      if (role == null || role.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Seleccione un rol')),
        );
        return;
      }

      await _authService.register(
        email: _emailController.text.trim(),
        password: _passwordController.text,
        roleName: role,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Usuario registrado exitosamente')),
      );
      Navigator.pop(context, {
        'username': _emailController.text.trim(),
      });
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error inesperado: $e')));
    }
  }

  void _cancel() {
    Navigator.pop(context);
  }

  @override
  void dispose() {
    _apiClient.close();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(
        title: 'Registrar Usuario',
        showBackButton: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              Image.asset('assets/img/logos/sir.png', height: 100),
              const SizedBox(height: 20),
              Row(
                children: [
                  const Expanded(
                    child: Text(
                      'Rol',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                  ),
                  TextButton.icon(
                    onPressed: _loadingRoles ? null : _loadRoles,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Actualizar'),
                  ),
                ],
              ),
              if (_loadingRoles) const LinearProgressIndicator(),
              if (_rolesError != null) ...[
                const SizedBox(height: 8),
                Text(
                  _rolesError!,
                  style: const TextStyle(color: Colors.red),
                ),
              ],
              const SizedBox(height: 8),
              DropdownButtonFormField<Role>(
                value: _selectedRole,
                items: _roles
                    .map(
                      (r) => DropdownMenuItem<Role>(
                        value: r,
                        child: Text(r.name),
                      ),
                    )
                    .toList(),
                onChanged: _roles.isEmpty
                    ? null
                    : (value) {
                        setState(() {
                          _selectedRole = value;
                        });
                      },
                decoration: const InputDecoration(
                  labelText: 'Seleccione un rol',
                  prefixIcon: Icon(Icons.badge),
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null) return 'Por favor seleccione un rol';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              // El email ahora es el identificador principal del usuario
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingrese un email';
                  }
                  if (!value.contains('@')) {
                    return 'Ingrese un email valido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Contrasena',
                  prefixIcon: Icon(Icons.lock),
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingrese una contrasena';
                  }
                  if (value.length < 8) {
                    return 'La contrasena debe tener al menos 8 caracteres';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _confirmPasswordController,
                decoration: const InputDecoration(
                  labelText: 'Confirmar Contrasena',
                  prefixIcon: Icon(Icons.lock_outline),
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor confirme su contrasena';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 30),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _register,
                      child: const Text('Registrar'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _cancel,
                      child: const Text('Cancelar'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
