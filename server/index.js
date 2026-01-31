import express from "express";
import helmet from "helmet";
import cors from "cors";
import { connectDB } from "./config/db.js";
import "dotenv/config";

// ✅ Routes import
import approverRoutes from "./routes/approverRoutes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "*", // change later when frontend domain is fixed
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: false,
  }),
);

app.use(express.json());
/* ---------- Routes ---------- */

// Approver dashboard APIs
app.use("/api/approver", approverRoutes);

/* ---------- start server ---------- */
const startServer = async () => {
  const PORT = process.env.PORT || 3000;

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
