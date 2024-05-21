import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import watchRouter from "./routes/watch.route.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors({
  allowedHeaders: ["*"],
  origin: "*"
}));

app.use(express.json());

app.use('/watch', watchRouter);

app.get('/', (req, res) => {
  res.send("Youtube Watch Service");
})

app.listen(PORT, () => {
  console.log(`Watch Server is listening on http://localhost:${PORT}`)
})