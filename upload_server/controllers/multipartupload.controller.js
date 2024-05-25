import AWS from 'aws-sdk';
import { addVideoDetailsToDB } from '../db/db.js';
import { pushVideoForEncodingToKafka } from './kafkaPublisher.controller.js'
// import fs from 'fs';

// const multipartUploadFileToS3 = async (req, res) => {
// 	console.log('Upload Request Received');

// 	const filePath = '/Users/shubhamkumar/Desktop/youtube/uploads/PolarBear.mp4';

// 	if (!fs.existsSync(filePath)) {
// 		console.log('File Does Not Exists: ', filePath);
// 		return res.status(400).send('File does not exists');
// 	}

// 	AWS.config.update({
// 		region: 'us-east-1',
// 		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// 	});

// 	const s3 = new AWS.S3();
// 	const uploadParams = {
// 		Bucket: process.env.AWS_BUCKET,
// 		Key: 'polarBear-key',
// 		ACL: 'public-read',
// 		ContentType: 'video/mp4'
// 	};

// 	try {
// 		console.log('Creating Multi Part Upload');
// 		const multipartParams = await s3
// 			.createMultipartUpload(uploadParams)
// 			.promise();
// 		const fileSize = fs.statSync(filePath).size;
// 		const chunkSize = 5 * 1024 * 1024;
// 		const numParts = Math.ceil(fileSize / chunkSize);

// 		const uploadedETags = [];

// 		for (let i = 0; i < numParts; i++) {
// 			const start = i * chunkSize;
// 			const end = Math.min(start + chunkSize, fileSize);

// 			const partParams = {
// 				Bucket: uploadParams.Bucket,
// 				Key: uploadParams.Key,
// 				UploadId: multipartParams.UploadId,
// 				PartNumber: i + 1,
// 				Body: fs.createReadStream(filePath, { start, end }),
// 				ContentLength: end - start
// 			};

// 			const data = await s3.uploadPart(partParams).promise();
// 			console.log(`Uploaded Part ${i + 1} : ${data.ETag} `);

// 			uploadedETags.push({ PartNumber: i + 1, ETag: data.ETag });
// 		}

// 		const completeParams = {
// 			Bucket: uploadParams.Bucket,
// 			Key: uploadParams.Key,
// 			UploadId: multipartParams.UploadId,
// 			MultipartUpload: { Parts: uploadedETags }
// 		};

// 		console.log('Completing MultiPart Upload');
// 		const completeRes = await s3
// 			.completeMultipartUpload(completeParams)
// 			.promise();
// 		console.log(completeRes);

// 		console.log('File Uploaded Successfully');
// 		res.status(200).send('File Uploaded Successfully');
// 	} catch (error) {
// 		console.log('Error Uploading File: ', error);
// 		res.status(500).send('File Could not be uploaded');
// 	}
// };

// export default multipartUploadFileToS3;

// Upload Initialization

export const initializeUpload = async (req, res) => {
	try {
		console.log('Initializing Upload');
		const { filename } = req.body;
		console.log(filename);
		const s3 = new AWS.S3({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: 'us-east-1'
		});
		const bucketName = process.env.AWS_BUCKET;

		const createParams = {
			Bucket: bucketName,
			Key: filename,
			ContentType: 'video/mp4'
		};

		const multipartParams = await s3
			.createMultipartUpload(createParams)
			.promise();
		console.log('Multi Part Params ---------------', multipartParams);
		const uploadId = multipartParams.UploadId;

		res.status(200).json({ uploadId });
	} catch (error) {
		console.log('Error initializing the Upload: ', error);
		res.status(500).send('Upload Initialization failed');
	}
};

// Uploading Chunks

export const uploadChunk = async (req, res) => {
	try {
		console.log('Uploading Chunk');
		const { filename, chunkIndex, uploadId } = req.body;
		const s3 = new AWS.S3({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: 'us-east-1'
		});

		const bucketName = process.env.AWS_BUCKET;

		const partParams = {
			Bucket: bucketName,
			Key: filename,
			UploadId: uploadId,
			PartNumber: parseInt(chunkIndex) + 1,
			Body: req.file.buffer
		};

		const data = await s3.uploadPart(partParams).promise();
		console.log('data------------', data);

		res.status(200).json({ success: true });
	} catch (error) {
		console.log('Error Uploading Chunk: ', err);
		res.status(500).send('Chunks couldnot be uploaded');
	}
};

// Complete Upload

export const completeUpload = async (req, res) => {
	try {
		console.log('Completing Upload');
		const { filename, totalChunks, uploadId, title, description, author } = req.body;
		const uploadedparts = [];

		// Build uploaded parts array from request body
		for (let i = 0; i < totalChunks; i++) {
			uploadedparts.push({ PartNumber: i + 1, ETag: req.body[`part${i + 1}`] });
		}

		const s3 = new AWS.S3({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: 'us-east-1'
		});

		const bucketName = process.env.AWS_BUCKET;

		const completeParams = {
			Bucket: bucketName,
			Key: filename,
			UploadId: uploadId
		};

		const data = await s3.listParts(completeParams).promise();

		const parts = data.Parts.map(part => ({
			ETag: part.ETag,
			PartNumber: part.PartNumber
		}));

		completeParams.MultipartUpload = {
			Parts: parts
		};

		const uploadResult = await s3
			.completeMultipartUpload(completeParams)
			.promise();

		console.log('data-----------', uploadResult);

		await addVideoDetailsToDB(
			title,
			description,
			author,
			uploadResult.Location
		);
		pushVideoForEncodingToKafka(title, uploadResult.Location)
		return res.status(200).json({ message: 'Uploaded Successfully!' });
	} catch (error) {
		console.log('Error Completing Upload: ', error);
		return res.status(500).send('Upload Completion failed');
	}
};

export const uploadToDb = async (req, res) => {
	console.log('Adding Details To DB');

	try {
		const videoDetails = req.body;
		await addVideoDetailsToDB(
			videoDetails.title,
			videoDetails.description,
			videoDetails.author,
			videoDetails.url
		);
		return res.status(200).send('SUCCESS');
	} catch (error) {
		console.log('Error Updating Database');
		return res.status(400).send('Error Updating Database ', error);
	}
};
