import { getServers } from "../src/controllers/servers.controller.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await getServers(req);
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
