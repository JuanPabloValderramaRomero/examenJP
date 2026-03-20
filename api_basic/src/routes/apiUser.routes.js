/**
*Author: 	DIEGO CASALLAS
*Date:		01/01/2026  
*Description:	This file defines the routes for the API user management. It includes routes for creating, retrieving, updating, and deleting API users, as well as routes for user login and token verification. The routes are handled by the corresponding controller functions imported from 'apiUser.controller.js'.
**/
import { Router } from 'express';
import { showApiUser, showApiUserId, addApiUser, updateApiUser, deleteApiUser, loginApiUser,verifyTokenLogin } from '../controllers/apiUser.controller.js';

const router = Router();
const apiName = '/apiUser';

// Public auth endpoints (frontend friendly) mounted by app as /auth
router.route('/register')
  .post(addApiUser); // Register user

router.route('/login')
  .post(loginApiUser); // Login user

router.route('/verify-token')
  .post(verifyTokenLogin); // Verify token

// Legacy/internal API endpoints (existing behavior)
router.route(apiName)
  .get(showApiUser)  // Get all users
  .post(addApiUser); // Add user

// Auth endpoints (register/login) with same controller logic
router.post('/auth/register', addApiUser);
router.post('/auth/login', loginApiUser);
router.post('/auth/verify-token', verifyTokenLogin);

router.route('/apiUserLogin')
  .post(loginApiUser); // Legacy Login

router.route('/apiUserVerifyToken')
  .post(verifyTokenLogin); // Legacy Verify Token

router.route(`${apiName}/:id`)
  .get(showApiUserId)  // Get user by Id
  .put(updateApiUser)  // Update user by Id
  .delete(deleteApiUser); // Delete user by Id

export default router;