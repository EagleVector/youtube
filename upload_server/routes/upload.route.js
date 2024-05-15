import express from 'express';
import uploadFileToS3 from '../controllers/upload.controller.js'

const uploadRouter = express.Router();
uploadRouter.post('/', uploadFileToS3);

export default uploadRouter;