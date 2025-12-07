// /src/controllers/servers.controller.js
import { extractServers } from "../extractors/streamInfo.extractor.js";

export const getServers = async (req, res) => {
  try {
    const { ep } = req.query;

    if (!ep) {
      return res.status(400).json({ error: "Episode (ep) query parameter is required" });
    }

    const servers = await extractServers(ep);

    // Send JSON response
    return res.status(200).json(servers);
  } catch (e) {
    console.error("Error in getServers:", e);
    return res.status(500).json({ error: e.message || "Internal server error" });
  }
};
