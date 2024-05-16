import express from 'express';
import uploadFileToS3 from '../controllers/upload.controller.js';
import multer from 'multer';
const upload = multer();

const uploadRouter = express.Router();
uploadRouter.post(
	'/',
	upload.fields([
		{ name: 'chunk' },
		{ name: 'totalChunks' },
		{ name: 'chunkIndex' }
	]),
	uploadFileToS3
);

export default uploadRouter;