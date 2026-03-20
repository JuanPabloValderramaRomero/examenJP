import {Router} from 'express';
import {showModules, showModuleId, addModule, updateModule, deleteModule} from '../controllers/modules.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router=Router();
const apiName='/modules';

router.route(apiName)
  .get(verifyToken, showModules)
  .post(verifyToken, addModule);

router.route(`${apiName}/:id`)
  .get(verifyToken, showModuleId)
  .put(verifyToken, updateModule)
  .delete(verifyToken, deleteModule);

export default router;
