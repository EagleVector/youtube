import express from 'express';
import {
	initializeUpload,
	uploadChunk,
	completeUpload,
	uploadToDb
} from '../controllers/multipartupload.controller.js';
// import uploadFileToS3 from '../controllers/upload.controller.js';
import multer from 'multer';
// import multipartUploadFileToS3 from '../controllers/multipartupload.controller.js';
const upload = multer();

const uploadRouter = express.Router();
// uploadRouter.post(
// 	'/',
// 	upload.fields([
// 		{ name: 'chunk' },
// 		{ name: 'totalChunks' },
// 		{ name: 'chunkIndex' }
// 	]),
// 	uploadFileToS3
// );

// Route For initializing Upload
uploadRouter.post('/initialize', upload.none(), initializeUpload);

// Route For Uploading Individual Chunks
uploadRouter.post('/', upload.single('chunk'), uploadChunk);

// Route for completing the upload
uploadRouter.post('/complete', completeUpload);

// Updating Video Metadata to PG
uploadRouter.post('/uploadToDB', uploadToDb);

export default uploadRouter;
