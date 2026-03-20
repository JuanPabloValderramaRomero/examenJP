
/**
*Author: 	DIEGO CASALLAS
*Date:		01/01/2026  
*Description:	This code defines a `UserApiModel` class that provides methods for managing API users in a database. The class includes methods for showing all users, showing a user by ID, adding a new user, updating an existing user, deleting a user, and logging in a user. Each method interacts with the database using SQL queries and handles errors appropriately, returning JSON responses with relevant status codes and messages. The `loginApiUser` method also generates a JSON Web Token (JWT) for authenticated users, which can be used for subsequent requests to protected routes.
**/
import { connect } from '../config/db/connect.js';
import { encryptPassword, comparePassword } from '../library/appBcrypt.js';
import jwt from "jsonwebtoken";

class UserApiModel {
  constructor(id, user, password, status, role) {
    this.id = id;
    this.user = user;
    this.password = password;
    this.status = status;
    this.role = role;
  }

  /* The `showApiUser` method in the `UserApiModel` class is an asynchronous function that fetches all
  users from the database. Here's a breakdown of what it does: */
  async showApiUser(req, res) {
    try {
      let sqlQuery = "SELECT * FROM api_users";
      const [result] = await connect.query(sqlQuery);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error fetching users", details: error.message });
    }
  };

  /* The `showApiUserId` method in the `UserApiModel` class is an asynchronous function that fetches a
  specific user from the database based on the provided user ID. Here's a breakdown of what it does: */
  async showApiUserId(req, res) {
    try {
      const [result] = await connect.query('SELECT * FROM api_users WHERE Api_user_id= ?', [req.params.id]);
      if (result.length === 0) return res.status(404).json({ error: "user not found" });
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Error fetching user", details: error.message });
    }
  };

  /* The `addApiUser` method in the `UserApiModel` class is an asynchronous function that handles the
  addition of a new user to the database. Here's a breakdown of what it does: */
  async addApiUser(req, res) {
    try {
      const { username: reqUsername, user, email, password, rol, role, status } = req.body;
      const finalUser = (reqUsername || user || '').toString().trim();
      const finalRoleRaw = (rol || role || '').toString().trim();
      const finalStatus = (status || 'Active').toString().trim();
      const finalEmail = (email || (finalUser.includes('@') ? finalUser : '')).toString().trim();

      // Usar el correo electrÃ³nico como identificador principal (Api_user)
      const apiUserValue = finalEmail;

      if (!finalEmail) return res.status(400).json({ ok: false, message: 'email requerido' });
      if (!password) return res.status(400).json({ ok: false, message: 'password requerido' });
      if (!finalRoleRaw) return res.status(400).json({ ok: false, message: 'rol requerido' });

      if (apiUserValue.length < 3 || apiUserValue.length > 30) {
        return res.status(400).json({ ok: false, message: 'username debe tener entre 3 y 30 caracteres' });
      }
      if (password.length < 8) {
        return res.status(400).json({ ok: false, message: 'password debe tener mÃ­nimo 8 caracteres' });
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(finalEmail)) {
        return res.status(400).json({ ok: false, message: 'email invÃ¡lido' });
      }

      const statusIdMap = {
        active: 1,
        inactive: 2
      };

      const normalizedStatus = finalStatus.toString().toLowerCase();
      const finalStatusId = statusIdMap[normalizedStatus];

      const [roleRows] = await connect.query(
        'SELECT Roles_id, Roles_name FROM roles WHERE LOWER(Roles_name) = LOWER(?) LIMIT 1',
        [finalRoleRaw]
      );

      if (roleRows.length === 0) {
        return res.status(400).json({
          ok: false,
          message: 'rol invalido, seleccione uno existente en la tabla roles',
        });
      }

      const finalRoleId = roleRows[0].Roles_id;
      const finalRole = roleRows[0].Roles_name;
      if (!['Active', 'Inactive'].includes(finalStatus)) {
        return res.status(400).json({ ok: false, message: 'status invÃ¡lido' });
      }

      const [emailColumn] = await connect.query("SHOW COLUMNS FROM api_users LIKE 'Api_email'");
      const hasEmailColumn = emailColumn.length > 0;

      // Verificar duplicados usando el email como identificador principal
      let duplicateQuery = 'SELECT * FROM api_users WHERE Api_user = ?';
      const duplicateParams = [apiUserValue];
      if (hasEmailColumn) {
        duplicateQuery += ' OR Api_email = ?';
        duplicateParams.push(finalEmail);
      }

      const [duplicate] = await connect.query(duplicateQuery, duplicateParams);
      if (duplicate.length > 0) {
        return res.status(409).json({ ok: false, message: 'Email ya registrado' });
      }

      const [usersTable] = await connect.query("SHOW TABLES LIKE 'users'");
      const shouldSyncUsers = usersTable.length > 0;
      if (shouldSyncUsers) {
        const [duplicateUsers] = await connect.query('SELECT * FROM users WHERE User_user = ? OR User_email = ?', [apiUserValue, finalEmail]);
        if (duplicateUsers.length > 0) {
          return res.status(409).json({ ok: false, message: 'Email ya registrado en users' });
        }
      }

      const hashedPassword = await encryptPassword(password);

      const apiUsersRole = finalRole;
      let sqlQuery;
      let insertParams;
      if (hasEmailColumn) {
        sqlQuery = 'INSERT INTO api_users(Api_user,Api_email,Api_password,Api_status,Api_role) VALUES (?,?,?,?,?)';
        insertParams = [apiUserValue, finalEmail, hashedPassword, finalStatus, apiUsersRole];
      } else {
        sqlQuery = 'INSERT INTO api_users(Api_user,Api_password,Api_status,Api_role) VALUES (?,?,?,?)';
        insertParams = [apiUserValue, hashedPassword, finalStatus, apiUsersRole];
      }
      const [result] = await connect.query(sqlQuery, insertParams);

      if (shouldSyncUsers) {
        await connect.query('INSERT INTO users (User_user,User_email,User_password,Roles_fk,User_status_fk) VALUES (?,?,?,?,?)', [apiUserValue, finalEmail, hashedPassword, finalRoleId, finalStatusId]);
      }

      const token = jwt.sign(
        { id: result.insertId, user: apiUserValue, role: finalRole, status: finalStatus },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );

      return res.status(201).json({
        ok: true,
        message: 'Usuario creado',
        data: { id: result.insertId, user: apiUserValue, role: finalRole, status: finalStatus },
        token
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: 'Error interno', details: error.message });
    }
  };

  /* The `updateApiUser` method in the `UserApiModel` class is an asynchronous function that handles
  updating an existing user in the database. Here's a breakdown of what it does: */
  async updateApiUser(req, res) {
    try {
      const { user, password, role, status } = req.body;
      if (!user || !password || !status || !role) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      let sqlQuery = "UPDATE  api_users SET Api_user=?,Api_password=?,Api_role =?,Api_status=?,Updated_at=? WHERE Api_user_id= ?";
      const updated_at = new Date().toLocaleString("en-CA", { timeZone: "America/Bogota" }).replace(",", "").replace("/", "-").replace("/", "-");
      const [result] = await connect.query(sqlQuery, [user, password, role, status, updated_at, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "user not found" });
      res.status(200).json({
        data: [{ user, status, role, updated_at }],
        status: 200,
        updated: result.affectedRows
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating user", details: error.message });
    }
  };

  /* The `deleteApiUser` method in the `UserApiModel` class is an asynchronous function that handles
  the deletion of a user from the database based on the provided user ID. Here's a breakdown of what
  it does: */
  async deleteApiUser(req, res) {
    try {
      let sqlQuery = "DELETE FROM api_users WHERE Api_user_id = ?";
      const [result] = await connect.query(sqlQuery, [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "user not found" });
      res.status(200).json({
        data: [],
        status: 200,
        deleted: result.affectedRows
      });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user", details: error.message });
    }
  };

  /**
   * The function `loginApiUser` is an asynchronous function that handles user authentication by checking
   * the API user credentials, generating a JWT token upon successful authentication, and returning the
   * token in the response.
   * @param req - The `req` parameter in the `loginApiUser` function represents the request object, which
   * contains information about the HTTP request made to the server. This object includes properties such
   * as headers, body, parameters, query strings, and more, depending on the type of request.
   * @param res - The `res` parameter in the `loginApiUser` function is typically the response object in
   * Node.js Express framework. It is used to send a response back to the client making the request. In
   * this function, `res` is used to send JSON responses with status codes and data back to the
   * @returns The `loginApiUser` function is returning a JSON response with a token if the login is
   * successful. If the user is not found or the password is incorrect, it will return an error message
   * in the JSON response. If there is an error during the process, it will return a 500 status with an
   * error message and details.
   */
  async loginApiUser(req, res) {
    try {
      const { api_user, api_password, username, email, password } = req.body;
      const loginUser = api_user || email || username;
      const loginPassword = api_password || password;

      if (!loginUser || !loginPassword) {
        return res.status(400).json({ ok: false, message: 'Credenciales incompletas' });
      }

      let user = null;
      let query = 'SELECT * FROM api_users WHERE Api_user = ?';
      let params = [loginUser];
      let authSource = 'api_users';

      if (email) {
        const [emailColumn] = await connect.query("SHOW COLUMNS FROM api_users LIKE 'Api_email'");
        if (emailColumn.length > 0) {
          query = 'SELECT * FROM api_users WHERE Api_user = ? OR Api_email = ?';
          params = [loginUser, email];
        }
      }

      const [result] = await connect.query(query, params);
      if (result.length > 0) {
        user = result[0];
      } else {
        const [usersTable] = await connect.query("SHOW TABLES LIKE 'users'");
        if (usersTable.length > 0) {
          const [resultUsers] = await connect.query('SELECT * FROM users WHERE User_user = ? OR User_email = ?', [loginUser, loginUser]);
          if (resultUsers.length > 0) {
            user = resultUsers[0];
            authSource = 'users';
          }
        }
      }

      if (!user) {
        return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
      }

      const hashedDbPassword = authSource === 'api_users' ? user.Api_password : user.User_password;
      const validPassword = await comparePassword(loginPassword, hashedDbPassword);
      if (!validPassword) {
        return res.status(401).json({ ok: false, message: 'ContraseÃ±a incorrecta' });
      }

      let userId = authSource === 'api_users' ? user.Api_user_id : user.User_id;
      let userName = authSource === 'api_users' ? user.Api_user : user.User_user;
      let userRole = authSource === 'api_users' ? user.Api_role : '';
      let userStatus = authSource === 'api_users' ? user.Api_status : (user.User_status_fk === 1 ? 'Active' : 'Inactive');

      // Preferir el nombre real del rol desde la tabla roles
      if (authSource === 'users') {
        try {
          const [roleRows] = await connect.query(
            'SELECT Roles_name FROM roles WHERE Roles_id = ? LIMIT 1',
            [user.Roles_fk]
          );
          if (roleRows.length > 0) {
            userRole = roleRows[0].Roles_name;
          }
        } catch (_) {}
      } else {
        try {
          const [usersTable] = await connect.query("SHOW TABLES LIKE 'users'");
          if (usersTable.length > 0) {
            const [roleRows] = await connect.query(
              'SELECT r.Roles_name FROM users u JOIN roles r ON u.Roles_fk = r.Roles_id WHERE u.User_email = ? OR u.User_user = ? LIMIT 1',
              [user.Api_user, user.Api_user]
            );
            if (roleRows.length > 0) {
              userRole = roleRows[0].Roles_name;
            }
          }
        } catch (_) {}
      }

      const token = jwt.sign(
        { id: userId, user: userName, role: userRole, status: userStatus },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );

      return res.status(200).json({ ok: true, message: 'Login exitoso', user: { id: userId, user: userName, role: userRole, status: userStatus }, token });
    } catch (error) {
      return res.status(500).json({ ok: false, message: 'Error interno', details: error.message });
    }
  }

};
export default UserApiModel;
