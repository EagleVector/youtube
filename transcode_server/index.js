import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import KafkaConfig from './kafka/kafka.js';
import convertToHLS from './hls/transcode.js';
import s3Tos3 from './hls/s3Tos3.js'

dotenv.config();
const PORT = process.env.PORT || 8001;

const app = express();

app.use(cors({
  allowedHeaders: ["*"],
  origin: "*"
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Transcoder service');
});

app.get('/transcode', (req, res) => {
  s3Tos3();
  // convertToHLS();
  res.send('Transcoding Completed!');
})

const kafkaConfig = new KafkaConfig()
kafkaConfig.consume("transcode", async (message) => {
  try {
    console.log("Got Data from Kafka: ", message);

    // Parsing JSON message value
    const value  = JSON.parse(message);

    // Checking if the value and the filename exists
    if (value && value.filename) {
      console.log("Filename is: ", value.filename);
      await s3Tos3(value.filename);
    } else {
      console.log("Didnot receive filename to be picked from S3");
    }
  } catch (error) {
    console.log("Error processing Kafka Message: ", error);
  }
})

app.listen(PORT, () => {
  console.log(`Transcoding Server listening on http://localhost:${PORT}`)
});