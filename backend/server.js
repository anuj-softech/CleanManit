import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { conn } from "./conn/conn.js";
import RequestRoutes from "./routes/RequestRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import LocationRoutes from "./routes/LocationRoutes.js";
import DriverRoutes from "./routes/DriverRoutes.js";
import SupervisorRoutes from "./routes/SupervisorRoutes.js";
import CareTakerRoutes from "./routes/CareTakerRoutes.js";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS with Credentials for cookie transport
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or any localhost/frontend origin
      callback(null, true);
    },
    credentials: true,
  })
);

conn();

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/emergency",RequestRoutes);
app.use("/api/location",LocationRoutes);
app.use("/api/driver",DriverRoutes);
app.use("/api/supervisor",SupervisorRoutes);
app.use("/api/caretaker",CareTakerRoutes);



app.listen(process.env.PORT, () => {
  console.log(
    `Server Started On Port ${process.env.PORT}`
  );
});