import express from "express";
import helmet from "helmet";
import cors from "cors";
import responseTime from "response-time";
import client from "prom-client";
import ApiRoutes from "./routes/api.js";
import { limiter } from "./config/ratelimiter.js";
import fileUpload from "express-fileupload";
import "dotenv/config";
import { messages } from "@vinejs/vine/defaults";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import prisma from "./DB/db.config.js";
import logger from "./config/logger.js";
import { cli } from "winston/lib/winston/config/index.js";
const swaggerDocument = YAML.load("./swagger.yml");
const app = express();
const PORT = process.env.PORT || 5000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({
  name: "http_express_req_res_time",
  help: "This tell how much time is takend by req and res",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
});

const totalReqCounter = new client.Counter({
  name: "total_req",
  help: "Tells toal req",
});

app.use(
  responseTime((req, res, time) => {
    totalReqCounter.inc();
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: req.statusCode,
      })
      .observe(time);
  })
);

async function checkDBConnection() {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL database connected successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}

await checkDBConnection();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());
// app.use(limiter);
app.use("/api", ApiRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hii from server!!");
});

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

app.listen(PORT, () => {
  console.log(`✅ Server is runnig at port ${PORT}`);
});
