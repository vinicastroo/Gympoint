import { Router } from 'express';

const routes = new Router();

import SessionController from '../src/app/controllers/SessionController';
import StudentController from '../src/app/controllers/StudentController';

import authMiddleware from './app/middleware/auth';

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

export default routes;
