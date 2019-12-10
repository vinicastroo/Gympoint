import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanManagementController from './app/controllers/PlanManagementController';

import EnrollmentManagementController from './app/controllers/EnrollmentManagementController';
import StudentCheckinController from './app/controllers/StudentCheckinController';
import HelpOrdersControoler from './app/controllers/HelpOrdersController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.get('/students/:student_id/checkin', StudentCheckinController.index);
routes.post('/students/:student_id/checkin', StudentCheckinController.store);

routes.get('/students/:student_id/help-orders', HelpOrdersControoler.index);
routes.post('/students/:student_id/help-orders', HelpOrdersControoler.store);

routes.use(authMiddleware);

routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

routes.get('/plan', PlanManagementController.index);
routes.post('/plan', PlanManagementController.store);
routes.put('/plan/:id', PlanManagementController.update);
routes.delete('/plan/:id', PlanManagementController.delete);

routes.get('/enrollment', EnrollmentManagementController.index);
routes.post('/enrollment', EnrollmentManagementController.store);
routes.put('/enrollment/:id', EnrollmentManagementController.update);
routes.delete('/enrollment/:id', EnrollmentManagementController.delete);

routes.get('/help-orders', HelpOrdersControoler.index);
routes.put('/help-orders/:id', HelpOrdersControoler.update);

export default routes;
