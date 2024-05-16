import KafkaConfig from '../kafka/kafka.js';

const sendMessageToKafka = async (req, res) => {
	console.log('Inside Upload Server');
	try {
		const message = req.body;
		console.log('Body: ', message);
		const kafkaConfig = new KafkaConfig();
		const msgs = [
			{
				key: 'key1',
				value: JSON.stringify(message)
			}
		];
		const result = await kafkaConfig.produce('transcode', msgs);
		console.log('Published Result: ', result);
		res.status(200).json('message uploaded successfully');
	} catch (error) {
		console.log(error);
	}
};

export default sendMessageToKafka;
