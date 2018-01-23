import * as express from 'express';

import * as messageController from '../controllers/messageController';
import * as baseController from '../controllers/baseController';
import * as constants from '../static/constants';


const router = express.Router();

router.get(constants.ROUTE_VERIFY, baseController.verify);
router.post(constants.ROUTE_MESSAGE, messageController.message);

export default router;
