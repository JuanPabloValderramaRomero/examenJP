import { connect } from '../config/db/connect.js';

class ModulesModel {
  constructor(id, name, description, route, icon, submodule, parentModule) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.route = route;
    this.icon = icon;
    this.submodule = submodule;
    this.parentModule = parentModule;
  }

  async addModule(req, res) {
    try {
      const { name, description, route, icon, submodule, parentModule } = req.body;
      if (!name || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const sqlQuery = "INSERT INTO modules (Modules_name, Modules_description, Modules_route, Modules_icon, Modules_submodule, Modules_parent_module, create_at) VALUES (?,?,?,?,?,?,?)";
      const create_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
      const [result] = await connect.query(sqlQuery, [name, description, route || null, icon || null, submodule ?? 0, parentModule ?? null, create_at]);
      res.status(201).json({ data: [{ id: result.insertId, name, description, route, icon, submodule, parentModule }], status: 201 });
    } catch (error) {
      res.status(500).json({ error: "Error adding Module", details: error.message });
    }
  }

  async updateModule(req, res) {
    try {
      const { name, description, route, icon, submodule, parentModule } = req.body;
      if (!name || !description) return res.status(400).json({ error: "Missing required fields" });
      const update_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
      const sqlQuery = "UPDATE modules SET Modules_name=?, Modules_description=?, Modules_route=?, Modules_icon=?, Modules_submodule=?, Modules_parent_module=?, update_at=? WHERE Modules_id=?";
      const [result] = await connect.query(sqlQuery, [name, description, route || null, icon || null, submodule ?? 0, parentModule ?? null, update_at, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Module not found" });
      res.status(200).json({ data: [{ name, description, route, icon, submodule, parentModule, update_at }], status: 200, updated: result.affectedRows });
    } catch (error) {
      res.status(500).json({ error: "Error updating Module", details: error.message });
    }
  }

  /**
   * Delete a module by its id.
   */
  async deleteModule(req, res) {
    try {
      let sqlQuery = "DELETE FROM modules WHERE Modules_id = ?";
      const [result] = await connect.query(sqlQuery, [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Module not found" });
      res.status(200).json({
        data: [],
        status: 200,
        deleted: result.affectedRows
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting Module", details: error.message });
    }
  }

  async showModules(res) {
    try {
      let sqlQuery = "SELECT * FROM modules";
      const [result] = await connect.query(sqlQuery);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Modules", details: error.message });
    }
  }

  async showModuleById(res, req) {
    try {
      const [result] = await connect.query('SELECT * FROM modules WHERE Modules_id = ?', [req.params.id]);
      if (result.length === 0) return res.status(404).json({ error: "Module not found" });
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Error fetching Module", details: error.message });
    }
  }

}

export default ModulesModel;
