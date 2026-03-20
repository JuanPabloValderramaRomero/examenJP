import ProfileModel from '../models/profile.model.js';

export const getProfile = async (req, res) => {
  try {
    const profileModel = new ProfileModel();
    profileModel.showProfile(res, req);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile", details: error.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const profileModel = new ProfileModel();
    profileModel.addProfile(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error creating profile", details: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profileModel = new ProfileModel();
    profileModel.updateProfile(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error updating profile", details: error.message });
  }
};

export const getUserPermissions = async (req, res) => {
  try {
    const profileModel = new ProfileModel();
    profileModel.getUserPermissions(res, req);
  } catch (error) {
    res.status(500).json({ error: "Error fetching permissions", details: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const profileModel = new ProfileModel();
    profileModel.changePassword(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error changing password", details: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const profileModel = new ProfileModel();
    profileModel.deleteProfile(req, res);
  } catch (error) {
    res.status(500).json({ error: "Error deleting profile", details: error.message });
  }
};
