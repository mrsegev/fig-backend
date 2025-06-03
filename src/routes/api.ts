import { Router } from 'express';
import integrationsRouter from './integrations';
import executionsRouter from './executions';

const router = Router();

router.use('/integrations', integrationsRouter);
router.use('/executions', executionsRouter);

export default router; 