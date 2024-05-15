import AWS from 'aws-sdk';
import fs from 'fs';

const uploadFileToS3 = async (req, res) => {
	const filePath =
		'/Users/shubhamkumar/Desktop/youtube/upload_server/assets/00415_Daniel_Ricciardo_Zandvoort_1920x1080_Desktop.jpg';

	if (!fs.existsSync(filePath)) {
		console.log('File Does Not Exist: ', filePath);
		return;
	}

	AWS.config.update({
		region: 'us-east-1',
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	});

	const params = {
		Bucket: process.env.AWS_BUCKET,
		Key: 'f1.png',
		Body: fs.createReadStream(filePath)
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
