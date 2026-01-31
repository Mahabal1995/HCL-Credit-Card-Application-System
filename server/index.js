import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
const app = express();

/* ---------- security & common middlewares ---------- */

app.use(helmet());

app.use(
  cors({
    origin: "*", // change later when frontend domain is fixed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: false,
  }),
);

app.use(express.json());

/* ---------- routes ---------- */

/* ---------- start server ---------- */

const startServer = async () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
