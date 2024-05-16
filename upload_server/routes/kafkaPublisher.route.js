import express from 'express';
import sendMessageToKafka from '../controllers/kafkaPublisher.controller.js';

const kafkaPublishRouter = express.Router();

kafkaPublishRouter.post('/', sendMessageToKafka);
export default kafkaPublishRouter;