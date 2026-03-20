import ModulesModel from '../models/modules.model.js';

export const showModules = async (req, res) => {
  try {
    const modulesModel = new ModulesModel();
    modulesModel.showModules(res);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Modules", details: error.message });
  }
};

export const showModuleId = async (req, res) => {
  try {
    const modulesModel = new ModulesModel();
    modulesModel.showModuleById(res, req);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Module", details: error.message });
  }
};

export const addModule = async (req, res) => {
  try {
    const modulesModel = new ModulesModel();
    modulesModel.addModule(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error adding Module", details: error.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    const modulesModel = new ModulesModel();
    modulesModel.updateModule(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error updating Module", details: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const modulesModel = new ModulesModel();
    modulesModel.deleteModule(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error deleting Module", details: error.message });
  }
};
