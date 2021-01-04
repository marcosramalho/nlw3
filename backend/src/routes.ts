import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import OrphanagesCotnroller from './controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/orphanages/:id', OrphanagesCotnroller.show);
routes.get('/orphanages', OrphanagesCotnroller.index);
routes.post('/orphanages', upload.array('images'), OrphanagesCotnroller.create);

export default routes;