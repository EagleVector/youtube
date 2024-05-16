import AWS from 'aws-sdk';

const uploadFileToS3 = async (req, res) => {
	console.log('Upload request Received!');

	console.log(req.files);

	if (
		!req.files ||
		!req.files['chunk'] ||
		!req.body['totalChunks'] ||
		!req.body['chunkIndex']
	) {
		console.log('Missing Required Data');
		return res.status(400).send('Missing Required Data');
	}

	const chunk = req.files['chunk'];
	const filename = req.body['filename'];
	const totalChunks = parseInt(req.body['totalChunks']);
	const chunkIndex = parseInt(req.body['chunkIndex']);
	console.log(filename);

	console.log(chunk[0].buffer);
	console.log(totalChunks);

	AWS.config.update({
		region: 'us-east-1',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

	if (req.body.totalChunks && req.body.chunkIndex !== undefined) {
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: `${filename}_${chunkIndex}`,
			Body: chunk[0].buffer
		};

		const s3 = new AWS.S3();

		// Upload the file to S3
		s3.upload(params, (err, data) => {
			if (err) {
				console.log('Error Uploading File: ', err);
				res.status(404).send('File couldnot be uploaded to S3');
			} else {
				console.log(
					'File uploaded successfully. File Location: ',
					data.Location
				);
				res.status(200).send('File uploaded Successfully');
			}
		});
	}
};

export default uploadFileToS3;
