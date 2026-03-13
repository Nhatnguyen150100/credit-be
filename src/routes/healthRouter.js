"use strict";
import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";
import { redisConnection } from "../config/queue";

const healthRouter = express.Router();

healthRouter.get("/", async (req, res) => {
  const startTime = Date.now();

  // --- MongoDB ---
  let mongoStatus = "ok";
  let mongoError = null;
  try {
    const state = mongoose.connection.readyState;
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    if (state !== 1) {
      mongoStatus = "error";
      mongoError = `readyState: ${state}`;
    }
  } catch (err) {
    mongoStatus = "error";
    mongoError = err.message;
  }

  // --- Redis ---
  let redisStatus = "ok";
  let redisError = null;
  const redisClient = createClient({
    socket: {
      host: redisConnection.host,
      port: redisConnection.port,
      connectTimeout: 3000,
    },
  });
  try {
    await redisClient.connect();
    await redisClient.ping();
  } catch (err) {
    redisStatus = "error";
    redisError = err.message;
  } finally {
    await redisClient.quit().catch(() => {});
  }

  // --- System ---
  const memUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const allOk = mongoStatus === "ok" && redisStatus === "ok";

  const payload = {
    status: allOk ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
    uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
    services: {
      mongodb: {
        status: mongoStatus,
        ...(mongoError && { error: mongoError }),
      },
      redis: {
        status: redisStatus,
        ...(redisError && { error: redisError }),
      },
    },
    system: {
      memoryUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
      memoryTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
      nodeVersion: process.version,
      env: process.env.NODE_ENV || "development",
    },
  };

  res.status(allOk ? 200 : 503).json(payload);
});

export default healthRouter;
