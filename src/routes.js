import { Router } from 'express';
import mongoose from 'mongoose';
import ExpressBrute from 'express-brute';
import MongooseStore from 'express-brute-mongoose';
import BruteForceSchema from 'express-brute-mongoose/dist/schema';

import AuthController from './app/controllers/AuthController';
import DoctorController from './app/controllers/DoctorController';
import PrescriptionController from './app/controllers/PrescriptionController';

import authMiddleware from './app/middlewares/auth';

const model = mongoose.model('bruteforce', new mongoose.Schema(BruteForceSchema));

const store = new MongooseStore(model);

const bruteforce = new ExpressBrute(store);

const routes = new Router();

// routes (public)
routes.post('/auth', bruteforce.prevent, AuthController.login);
routes.post('/doctor', DoctorController.store);

routes.use(authMiddleware);

// routes (private)
routes.get('/prescription', PrescriptionController.index);
routes.post('/prescription', PrescriptionController.store);

export default routes;
