import express from "express";
import cors from "cors";
import { verifyConnectivity } from "./config/neo4j";
import { Config } from "./config/config";
import searchRouter from "./routes/search";
import pathRouter from "./routes/path";

const app = express();
const PORT = Config.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/search", searchRouter);
app.use("/api/path", pathRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const start = async () => {
  await verifyConnectivity();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
