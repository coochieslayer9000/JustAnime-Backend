import express from "express";
import { getServers } from "../controllers/servers.controller.js";

const router = express.Router();

router.get("/servers", getServers);

export default router;
