import AWS from 'aws-sdk';

const uploadFileToS3 = async (req, res) => {

	console.log('Upload request Received!');

	if (!req.file) {
		console.log('No File Received from Client');
		return res.status(400).send('File Not Received')
	}

	const file = req.file;

	AWS.config.update({
		region: 'us-east-1',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

	const params = {
		Bucket: process.env.AWS_BUCKET,
		Key: file.originalname,
		Body: file.buffer
	};

	const s3 = new AWS.S3();

	// Upload the file to S3
	s3.upload(params, (err, data) => {
		if (err) {
			console.log('Error Uploading File: ', err);
			res.status(404).send('File couldnot be uploaded to S3');
		} else {
			console.log('File uploaded successfully. File Location: ', data.Location);
			res.status(200).send('File uploaded Successfully');
		}
	});
};

export default uploadFileToS3;
