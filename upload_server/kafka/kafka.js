import { Kafka } from 'kafkajs';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

class KafkaConfig {
	constructor() {
		this.kafka = new Kafka({
			clientId: 'youtube uploader',
			brokers: [process.env.AIVEN_KAFKA_SERVICE_URI],
			ssl: {
				ca: [fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')]
			},
			sasl: {
				username: process.env.AIVEN_KAFKA_USERNAME,
				password: process.env.AIVEN_KAFKA_PASSWORD,
				mechanism: 'plain'
			}
		});

		this.producer = this.kafka.producer();
		this.consumer = this.kafka.consumer({ groupId: 'youtube-uploader' });
	}

	async produce(topic, messages) {
		try {
			const result = await this.producer.connect();
			console.log('Kafka Connected... : ', result);
			await this.producer.send({
				topic: topic,
				messages: messages
			});
		} catch (error) {
			console.log(error);
		} finally {
			await this.producer.disconnect();
		}
	}

	async consume(topic, callback) {
		try {
			await this.consumer.connect();
			await this.consumer.subscribe({ topic: topic, fromBeginning: true });
			await this.consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					const value = message.value.toString();
					callback(value);
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
}

export default KafkaConfig;
