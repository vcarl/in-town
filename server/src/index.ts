import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Effect } from "effect";
import { DatabaseServiceLive } from "./layers/database.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// OpenAPI documentation endpoint
app.get("/openapi.json", (_req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "In-Town API",
      version: "1.0.0",
      description: "Minimal API for In-Town app - primarily for future authentication",
    },
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": {
              description: "Service is healthy",
            },
          },
        },
      },
    },
  });
});

// Initialize Effect-TS layers and start server
const main = Effect.gen(function* () {
  console.log("Initializing services...");

  // Start server
  yield* Effect.promise(() => {
    return new Promise<void>((resolve) => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📖 API documentation: http://localhost:${PORT}/openapi.json`);
        console.log(`❤️  Health check: http://localhost:${PORT}/health`);
        resolve();
      });
    });
  });
});

// Run the program
const program = Effect.provide(main, DatabaseServiceLive);

Effect.runPromise(program).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
