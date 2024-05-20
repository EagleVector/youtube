import AWS from 'aws-sdk';
import fs from 'fs';

const multipartUploadFileToS3 = async (req, res) => {
	console.log('Upload Request Received');

	const filePath = '/Users/shubhamkumar/Desktop/youtube/uploads/PolarBear.mp4';

	if (!fs.existsSync(filePath)) {
		console.log('File Does Not Exists: ', filePath);
		return res.status(400).send('File does not exists');
	}

	AWS.config.update({
		region: 'us-east-1',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

	const s3 = new AWS.S3();
	const uploadParams = {
		Bucket: process.env.AWS_BUCKET,
		Key: 'polarBear-key',
		ACL: 'public-read',
		ContentType: 'video/mp4'
	};

	try {
		console.log('Creating Multi Part Upload');
		const multipartParams = await s3
			.createMultipartUpload(uploadParams)
			.promise();
		const fileSize = fs.statSync(filePath).size;
		const chunkSize = 5 * 1024 * 1024;
		const numParts = Math.ceil(fileSize / chunkSize);

		const uploadedETags = [];

		for (let i = 0; i < numParts; i++) {
			const start = i * chunkSize;
			const end = Math.min(start + chunkSize, fileSize);

			const partParams = {
				Bucket: uploadParams.Bucket,
				Key: uploadParams.Key,
				UploadId: multipartParams.UploadId,
				PartNumber: i + 1,
				Body: fs.createReadStream(filePath, { start, end }),
				ContentLength: end - start
			};

			const data = await s3.uploadPart(partParams).promise();
			console.log(`Uploaded Part ${i + 1} : ${data.ETag} `);

			uploadedETags.push({ PartNumber: i + 1, ETag: data.ETag });
		}

		const completeParams = {
			Bucket: uploadParams.Bucket,
			Key: uploadParams.Key,
			UploadId: multipartParams.UploadId,
			MultipartUpload: { Parts: uploadedETags }
		};

		console.log('Completing MultiPart Upload');
		const completeRes = await s3
			.completeMultipartUpload(completeParams)
			.promise();
		console.log(completeRes);

		console.log('File Uploaded Successfully');
		res.status(200).send('File Uploaded Successfully');
	} catch (error) {
		console.log('Error Uploading File: ', error);
		res.status(500).send('File Could not be uploaded');
	}
};

export default multipartUploadFileToS3;
