import express from "express";
import { getServers } from "../controllers/servers.controller.js";

const router = express.Router();

router.get("/servers", getServers); // This connects the GET /servers endpoint to your controller

export default router;
