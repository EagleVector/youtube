import express from 'express';
import getAllVideos from '../controllers/home.controller.js';
import watchVideo from '../controllers/watch.controller.js';

const watchRouter = express.Router();

watchRouter.get('/', watchVideo);
watchRouter.get('/home', getAllVideos)


export default watchRouter;