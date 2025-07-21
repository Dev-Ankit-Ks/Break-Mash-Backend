// __tests__/auth.test.mjs
import request from "supertest";
import express from "express";
import ApiRoutes from "../routes/api.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";
import prisma from "../DB/db.config.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/api", ApiRoutes);

describe("🔐 Auth Endpoints E2E", () => {
  const testEmail = `user${Date.now()}@test.com`;
  const password = "Test@123";
  let authToken = "";
  let userId = "";

  it("✅ should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ankit",
      email: testEmail,
      password: password,
      password_confirmation: password,
      profile: "https://picsum.photos/200",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("email", testEmail);
  });

  it("❌ should fail on duplicate registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Ankit",
      email: testEmail,
      password: password,
      password_confirmation: password,
      profile: "https://picsum.photos/200",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toHaveProperty("email");
  });

  it("✅ should login the user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.details.email).toBe(testEmail);

    authToken = res.body.token;
    userId = res.body.details.id;

    // Save to a temp file for profile.test.mjs
    const filePath = path.join("tests", "auth-data.json");
    fs.mkdirSync("tests", { recursive: true });
    fs.writeFileSync(
      filePath,
      JSON.stringify({ authToken, userId, testEmail }, null, 2)
    );
  });

  it("❌ should fail login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "wrong123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("📧 should send email", async () => {
    const res = await request(app).post("/api/send-email").send({
      email: testEmail,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Email sent");
  });

  afterAll(async () => {
    await prisma.users.deleteMany({
      where: {
        email: {
          contains: "@test.com",
        },
      },
    });
    await prisma.$disconnect();
  });
});
