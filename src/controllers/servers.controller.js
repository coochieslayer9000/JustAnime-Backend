// /src/controllers/servers.controller.js
import { extractServers } from "../extractors/streamInfo.extractor.js";

export const getServers = async (req, res) => {
  try {
    const { ep } = req.query;
    const servers = await extractServers(ep);
    // send the JSON response
    res.status(200).json(servers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Something went wrong" });
  }
};
