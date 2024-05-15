import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRouter from './routes/upload.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  allowedHeaders: ["*"],
  origin: "*"
}));

app.use(express.json());
app.use('/upload', uploadRouter);

app.get('/', (req, res) => {
  res.send('Upload Server');
});

app.listen(PORT, () => {
  console.log(`Upload server listening on http://localhost:${PORT}`);
})