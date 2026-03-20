import {Router} from 'express';
import {showRoleModules, showRoleModuleId, showRoleModuleByRoleId, addRoleModule, updateRoleModule, deleteRoleModule} from '../controllers/roleModule.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router=Router();
const apiName='/roleModule';

router.route(apiName)
  .get(verifyToken, showRoleModules)
  .post(verifyToken, addRoleModule);

router.route(`${apiName}/:id`)
  .get(verifyToken, showRoleModuleId)
  .put(verifyToken, updateRoleModule)
  .delete(verifyToken, deleteRoleModule);

router.route(`${apiName}/byRole/:roleId`)
  .get(verifyToken, showRoleModuleByRoleId);

export default router;
