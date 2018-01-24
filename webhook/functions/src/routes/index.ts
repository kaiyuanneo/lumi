import * as express from 'express';

import * as lumiController from '../controllers/lumiController';
import * as pwfnController from '../controllers/pwfnController';
import * as constants from '../static/constants';


const router = express.Router();

router.get(constants.ROUTE_LUMI, lumiController.verify);
router.post(constants.ROUTE_LUMI, lumiController.message);
router.post(constants.ROUTE_PWFN, pwfnController.message);

export default router;
