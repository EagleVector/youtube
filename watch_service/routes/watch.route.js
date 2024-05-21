import express from 'express';
import watchVideo from '../controllers/watch.controller.js';

const watchRouter = express.Router();

watchRouter.get('/', watchVideo);

export default watchRouter;