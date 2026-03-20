class Role {
  final int id;
  final String name;
  final String? description;

  const Role({required this.id, required this.name, this.description});

  factory Role.fromJson(Map<String, dynamic> json) {
    final idRaw = json['Roles_id'] ?? json['id'];
    final nameRaw = json['Roles_name'] ?? json['name'];
    final descriptionRaw = json['Roles_description'] ?? json['description'];

    return Role(
      id: idRaw is int ? idRaw : int.parse(idRaw.toString()),
      name: nameRaw?.toString() ?? '',
      description: descriptionRaw?.toString(),
    );
  }

  @override
  String toString() => name;
}

