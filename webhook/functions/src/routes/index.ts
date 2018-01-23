import * as express from 'express';

import * as lumiController from '../controllers/lumiController';
import * as pwfnController from '../controllers/pwfnController';
import * as constants from '../static/constants';


const rootRouter = express.Router();

// All Lumi-related requests go to <webhook_url>/lumi/<path>
const lumiRouter = express.Router({ mergeParams: true });
lumiRouter.get(constants.ROUTE_LUMI_ROOT, lumiController.verify);
lumiRouter.post(constants.ROUTE_LUMI_ROOT, lumiController.message);
lumiRouter.get(constants.ROUTE_LUMI_PSID, lumiController.getPsidFromAsid);
rootRouter.use(constants.ROUTE_LUMI, lumiRouter);

// All PWFN-related requests go to <webhook_url>/pwfn/<path>
const pwfnRouter = express.Router({ mergeParams: true });
pwfnRouter.post(constants.ROUTE_PWFN_ROOT, pwfnController.message);
rootRouter.use(constants.ROUTE_PWFN, pwfnRouter);

export default rootRouter;
