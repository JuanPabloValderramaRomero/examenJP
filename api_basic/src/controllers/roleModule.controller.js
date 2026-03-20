import RoleModuleModel from '../models/roleModule.model.js';

export const showRoleModules = async (req, res) => {
  try {
    const roleModuleModel = new RoleModuleModel();
    roleModuleModel.showRoleModules(res);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Role Modules", details: error.message });
  }
};

export const showRoleModuleId = async (req, res) => {
  try {
    const roleModuleModel = new RoleModuleModel();
    roleModuleModel.showRoleModuleById(res, req);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Role Module", details: error.message });
  }
};

export const showRoleModuleByRoleId = async (req, res) => {
  try {
    const roleModuleModel = new RoleModuleModel();
    roleModuleModel.showRoleModuleByRole(res, req);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Role Modules by Role", details: error.message });
  }
};

export const addRoleModule = async (req, res) => {
  try {
    const roleModuleModel = new RoleModuleModel();
    roleModuleModel.addRoleModule(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error adding Role Module", details: error.message });
  }
};

export const updateRoleModule = async (req, res) => {
  try {
    const roleModuleModel = new RoleModuleModel();
    roleModuleModel.updateRoleModule(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error updating Role Module", details: error.message });
  }
};

export const deleteRoleModule = async (req, res) => {
  try {
    const roleModuleModel = new RoleModuleModel();
    roleModuleModel.deleteRoleModule(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error deleting Role Module", details: error.message });
  }
};
