import { connect } from '../config/db/connect.js';

class RoleModuleModel {
  constructor(id, moduleId, roleId) {
    this.id = id;
    this.moduleId = moduleId;
    this.roleId = roleId;
  }

  /**
   * Create a new role-module relation. Both moduleId and roleId are required.
   */
  async addRoleModule(req, res) {
    try {
      const { moduleId, roleId } = req.body;
      if (!moduleId || !roleId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      let sqlQuery = "INSERT INTO role_modules (Modules_fk, Roles_fk) VALUES (?,?)";
      const [result] = await connect.query(sqlQuery, [moduleId, roleId]);
      res.status(201).json({
        data: [{ id: result.insertId, moduleId, roleId }],
        status: 201
      });
    } catch (error) {
      res.status(500).json({ error: "Error adding Role Module", details: error.message });
    }
  }

  /**
   * Update a role-module mapping; requires both IDs.
   */
  async updateRoleModule(req, res) {
    try {
      const { moduleId, roleId } = req.body;
      if (!moduleId || !roleId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      let sqlQuery = "UPDATE role_modules SET Modules_fk=?, Roles_fk=?, update_at=? WHERE RoleModules_id=?";
      const update_at = new Date()
        .toLocaleString("en-CA", { timeZone: "America/Bogota" })
        .replace(",", "")
        .replace("/", "-")
        .replace("/", "-");
      const [result] = await connect.query(sqlQuery, [moduleId, roleId, update_at, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Role Module not found" });
      res.status(200).json({
        data: [{ moduleId, roleId, update_at }],
        status: 200,
        updated: result.affectedRows
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating Role Module", details: error.message });
    }
  }

  /**
   * Delete a role-module entry by its id.
   */
  async deleteRoleModule(req, res) {
    try {
      let sqlQuery = "DELETE FROM role_modules WHERE RoleModules_id = ?";
      const [result] = await connect.query(sqlQuery, [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Role Module not found" });
      res.status(200).json({
        data: [],
        status: 200,
        deleted: result.affectedRows
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting Role Module", details: error.message });
    }
  }

  async showRoleModules(res) {
    try {
      let sqlQuery = "SELECT rm.*, m.Modules_name, m.Modules_route, r.Roles_name FROM role_modules rm LEFT JOIN modules m ON rm.Modules_fk = m.Modules_id LEFT JOIN roles r ON rm.Roles_fk = r.Roles_id";
      const [result] = await connect.query(sqlQuery);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Role Modules", details: error.message });
    }
  }

  async showRoleModuleById(res, req) {
    try {
      const [result] = await connect.query('SELECT rm.*, m.Modules_name, m.Modules_route, r.Roles_name FROM role_modules rm LEFT JOIN modules m ON rm.Modules_fk = m.Modules_id LEFT JOIN roles r ON rm.Roles_fk = r.Roles_id WHERE rm.RoleModules_id = ?', [req.params.id]);
      if (result.length === 0) return res.status(404).json({ error: "Role Module not found" });
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Role Module", details: error.message });
    }
  }

  async showRoleModuleByRole(res, req) {
    try {
      const [result] = await connect.query('SELECT rm.*, m.Modules_name, m.Modules_route, m.Modules_description, m.Modules_icon FROM role_modules rm LEFT JOIN modules m ON rm.Modules_fk = m.Modules_id WHERE rm.Roles_fk = ?', [req.params.roleId]);
      if (result.length === 0) return res.status(404).json({ error: "No modules found for this role" });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Role Modules", details: error.message });
    }
  }

}

export default RoleModuleModel;
