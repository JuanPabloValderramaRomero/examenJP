import { connect } from '../config/db/connect.js';
import bcrypt from 'bcryptjs';

class ProfileModel {
  constructor(id, user, email, roleId, roleName, statusId, statusName) {
    this.id = id;
    this.user = user;
    this.email = email;
    this.roleId = roleId;
    this.roleName = roleName;
    this.statusId = statusId;
    this.statusName = statusName;
  }

  /**
   * Retrieve profile information.
   * If an ID is supplied via params, body, query or token, return that profile; otherwise return all.
   */
  async showProfile(res, req) {
    try {
      // ignore req.user when listing all
      const userId = req.params.id || req.body?.userId || req.query?.userId;

      if (!userId) {
        const sqlQuery = `
          SELECT 
            p.Profile_id as id,
            p.Profile_email as email,
            p.Profile_name as name,
            p.Profile_photo as photo,
            p.User_id_fk as userId,
            p.create_at,
            p.update_at
          FROM profiles p
        `;
        const [result] = await connect.query(sqlQuery);
        return res.status(200).json(result);
      }

      const sqlQuery = `
        SELECT 
          p.Profile_id as id,
          p.Profile_email as email,
          p.Profile_name as name,
          p.Profile_photo as photo,
          p.User_id_fk as userId,
          p.create_at,
          p.update_at
        FROM profiles p
        WHERE p.Profile_id = ? OR p.User_id_fk = ?
      `;
      const [result] = await connect.query(sqlQuery, [userId, userId]);
      if (result.length === 0) return res.status(404).json({ error: "Profile not found" });
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Error fetching profile", details: error.message });
    }
  }

  /**
   * Add a new profile record. Email, name and user id are mandatory.
   */
  async addProfile(req, res) {
    try {
      const { Profile_email, Profile_name, Profile_photo, User_id_fk } = req.body;

      if (!Profile_email || !Profile_name || !User_id_fk) {
        return res.status(400).json({ error: "Missing required fields: email, name, userId" });
      }

      const sqlQuery = `INSERT INTO profiles (Profile_email, Profile_name, Profile_photo, User_id_fk, create_at) VALUES (?, ?, ?, ?, NOW())`;
      const [result] = await connect.query(sqlQuery, [Profile_email, Profile_name, Profile_photo, User_id_fk]);

      res.status(201).json({
        data: [{ id: result.insertId, Profile_email, Profile_name, Profile_photo, User_id_fk }],
        status: 201
      });
    } catch (error) {
      res.status(500).json({ error: "Error creating profile", details: error.message });
    }
  }

  /**
   * Modify fields of a profile. Accepts email, name and/or photo. ID may come from token or params.
   */
  async updateProfile(req, res) {
    try {
      const userId = req.params.id || req.body?.userId || req.query?.userId;
      const { Profile_email, Profile_name, Profile_photo } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      let updateFields = [];
      let updateValues = [];

      if (Profile_email) {
        updateFields.push("Profile_email = ?");
        updateValues.push(Profile_email);
      }
      if (Profile_name) {
        updateFields.push("Profile_name = ?");
        updateValues.push(Profile_name);
      }
      if (Profile_photo) {
        updateFields.push("Profile_photo = ?");
        updateValues.push(Profile_photo);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      updateFields.push("update_at = NOW()");
      updateValues.push(userId);

// prefer to update by Profile_id if the supplied id matches one, otherwise by user fk
      const lookupClause = "profiles.Profile_id = ? OR profiles.User_id_fk = ?";
      const sqlQuery = `UPDATE profiles SET ${updateFields.join(", ")} WHERE ${lookupClause}`;
      // duplicate id for both placeholders
      const [result] = await connect.query(sqlQuery, [...updateValues, userId, userId]);

      if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found" });

      res.status(200).json({
        data: [{ Profile_email, Profile_name, Profile_photo }],
        status: 200,
        updated: result.affectedRows
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating profile", details: error.message });
    }
  }

  /**
   * Return the modules associated with a user through their role. Requires a valid user id.
   */
  async getUserPermissions(res, req) {
    try {
      const userId = req.params.id || req.user?.id || req.body?.userId || req.query?.userId;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const sqlQuery = `
        SELECT 
          DISTINCT m.Modules_id,
          m.Modules_name,
          m.Modules_route,
          m.Modules_description,
          m.Modules_icon,
          m.Modules_submodule,
          m.Modules_parent_module
        FROM users u
        INNER JOIN role_modules rm ON u.Roles_fk = rm.Roles_fk
        INNER JOIN modules m ON rm.Modules_fk = m.Modules_id
        WHERE u.User_id = ?
      `;

      const [result] = await connect.query(sqlQuery, [userId]);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error fetching permissions", details: error.message });
    }
  }

  /**
   * Change a user's password. Verifies current password before updating.
   */
  async changePassword(req, res) {
    try {
      const userId = req.params.id || req.user?.id || req.body?.userId || req.query?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let sqlQuery = "SELECT User_password FROM users WHERE User_id = ?";
      const [result] = await connect.query(sqlQuery, [userId]);

      if (result.length === 0) return res.status(404).json({ error: "User not found" });

      const passwordMatch = await bcrypt.compare(currentPassword, result[0].User_password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updated_at = new Date()
        .toLocaleString("en-CA", { timeZone: "America/Bogota" })
        .replace(",", "")
        .replace("/", "-")
        .replace("/", "-");
      sqlQuery = "UPDATE users SET User_password = ?, updated_at = ? WHERE User_id = ?";
      const [updateResult] = await connect.query(sqlQuery, [hashedPassword, updated_at, userId]);

      res.status(200).json({
        message: "Password updated successfully",
        status: 200
      });
    } catch (error) {
      res.status(500).json({ error: "Error changing password", details: error.message });
    }
  }

  /**
   * Delete a profile by Profile_id or User_id_fk.
   */
  async deleteProfile(req, res) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ error: "Profile id is required" });
      const sqlQuery = "DELETE FROM profiles WHERE Profile_id = ?";
      const [result] = await connect.query(sqlQuery, [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found" });
      res.status(200).json({ data: [], status: 200, deleted: result.affectedRows });
    } catch (error) {
      res.status(500).json({ error: "Error deleting profile", details: error.message });
    }
  }

}

export default ProfileModel;
