import {Router} from 'express';
import {getProfile, updateProfile, getUserPermissions, changePassword, createProfile, deleteProfile} from '../controllers/profile.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router=Router();
const apiName='/profile';

router.route(apiName)
  .get(verifyToken, getProfile)
  .post(verifyToken, createProfile)
  .put(verifyToken, updateProfile);

router.route(`${apiName}/:id`)
  .get(verifyToken, getProfile)
  .put(verifyToken, updateProfile)
  .delete(verifyToken, deleteProfile);

router.route(`${apiName}/permissions/:id`)
  .get(verifyToken, getUserPermissions);

router.route(`${apiName}/permissions`)
  .get(verifyToken, getUserPermissions);

router.route(`${apiName}/changePassword/:id`)
  .post(verifyToken, changePassword);

router.route(`${apiName}/changePassword`)
  .post(verifyToken, changePassword);

export default router;
