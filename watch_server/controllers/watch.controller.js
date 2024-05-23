import AWS from 'aws-sdk';

async function generateSignedURL(videoKey) {
	const s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: 'us-east-1'
	});

	const params = {
		Bucket: process.env.AWS_BUCKET,
		Key: videoKey,
		Expires: 3600
	};

	return new Promise((resolve, reject) => {
		s3.getSignedUrl('getObject', params, (err, url) => {
			if (err) {
				reject(err);
			} else {
				resolve(url);
			}
		});
	});
}

const watchVideo = async (req, res) => {
	try {
		const videoKey = req.query.key;
		const signedUrl = await generateSignedURL(videoKey);
		res.json({ signedUrl });
	} catch (error) {
		console.log('Error Generating pre-signed URL: ', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export default watchVideo;
