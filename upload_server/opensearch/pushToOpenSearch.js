import { Client } from '@opensearch-project/opensearch';
import dotenv from 'dotenv';

dotenv.config();

const PushToOpenSearch = async (title, description, author, videoUrl) => {
	try {
		console.log('Pushing to Open Search');

		var host = process.env.AIVEN_OS;

		var client = new Client({
			node: host
		});

		var index_name = 'video';
		var document = {
			title: title,
			author: author,
			description: description,
			videoUrl: videoUrl
		};

		var response = await client.index({
			id: title,
			index: index_name,
			body: document,
			refresh: true
		});

		console.log('Adding document:');
		console.log(response.body);
	} catch (error) {
		console.log(error.message);
	}
};

export default PushToOpenSearch;
