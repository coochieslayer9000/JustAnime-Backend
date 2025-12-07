import * as homeInfoController from "../controllers/homeInfo.controller.js";
import * as categoryController from "../controllers/category.controller.js";
import * as topTenController from "../controllers/topten.controller.js";
import * as animeInfoController from "../controllers/animeInfo.controller.js";
import * as streamController from "../controllers/streamInfo.controller.js";
import * as searchController from "../controllers/search.controller.js";
import * as episodeListController from "../controllers/episodeList.controller.js";
import * as suggestionsController from "../controllers/suggestion.controller.js";
import * as scheduleController from "../controllers/schedule.controller.js";
import * as serversController from "../controllers/servers.controller.js";
import * as randomController from "../controllers/random.controller.js";
import * as qtipController from "../controllers/qtip.controller.js";
import * as randomIdController from "../controllers/randomId.controller.js";
import * as producerController from "../controllers/producer.controller.js";
import * as characterListController from "../controllers/voiceactor.controller.js";
import * as nextEpisodeScheduleController from "../controllers/nextEpisodeSchedule.controller.js";
import { routeTypes } from "./category.route.js";
import { getWatchlist } from "../controllers/watchlist.controller.js";
import getVoiceActors from "../controllers/actors.controller.js";
import getCharacter from "../controllers/characters.controller.js";
import * as filterController from "../controllers/filter.controller.js";
import getTopSearch from "../controllers/topsearch.controller.js";
import * as graphqlController from "../controllers/graphql.controller.js";
import * as anilistOAuthController from "../controllers/anilist-oauth.controller.js";
import * as malOAuthController from "../controllers/mal-oauth.controller.js";
import * as malProxyController from "../controllers/mal-proxy.controller.js";

export const createApiRoutes = (app, jsonResponse, jsonError) => {
  // Helper for GET routes with CORS
  const createRoute = (path, controllerMethod) => {
    app.get(path, async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") return res.status(200).end();

      try {
        const data = await controllerMethod(req, res);
        if (!res.headersSent) return jsonResponse(res, data);
      } catch (err) {
        console.error(`Error in route ${path}:`, err);
        if (!res.headersSent) return jsonError(res, err.message || "Internal server error");
      }
    });
  };

  // Helper for POST routes with CORS
  const createPostRoute = (path, controllerMethod) => {
    app.post(path, async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") return res.status(200).end();

      try {
        await controllerMethod(req, res);
      } catch (err) {
        console.error(`Error in POST route ${path}:`, err);
        if (!res.headersSent) return res.status(500).json({ error: err.message || "Internal server error" });
      }
    });
  };

  // Home routes
  ["/api", "/api/"].forEach((route) => {
    createRoute(route, homeInfoController.getHomeInfo);
  });

  // Category routes
  routeTypes.forEach((routeType) =>
    createRoute(`/api/${routeType}`, (req, res) => categoryController.getCategory(req, res, routeType))
  );

  // Main API routes
  createRoute("/api/top-ten", topTenController.getTopTen);
  createRoute("/api/info", animeInfoController.getAnimeInfo);
  createRoute("/api/episodes/:id", episodeListController.getEpisodes);
  createRoute("/api/servers/:id", serversController.getServers);
  createRoute("/api/stream", (req, res) => streamController.getStreamInfo(req, res, false));
  createRoute("/api/stream/fallback", (req, res) => streamController.getStreamInfo(req, res, true));
  createRoute("/api/search", searchController.search);
  createRoute("/api/filter", filterController.filter);
  createRoute("/api/search/suggest", suggestionsController.getSuggestions);
  createRoute("/api/schedule", scheduleController.getSchedule);
  createRoute("/api/schedule/:id", nextEpisodeScheduleController.getNextEpisodeSchedule);
  createRoute("/api/random", randomController.getRandom);
  createRoute("/api/random/id", randomIdController.getRandomId);
  createRoute("/api/qtip/:id", qtipController.getQtip);
  createRoute("/api/producer/:id", producerController.getProducer);
  createRoute("/api/character/list/:id", characterListController.getVoiceActors);
  createRoute("/api/watchlist/:userId/:page?", getWatchlist);
  createRoute("/api/actors/:id", getVoiceActors);
  createRoute("/api/character/:id", getCharacter);
  createRoute("/api/top-search", getTopSearch);

  // OAuth and proxy routes
  createPostRoute("/api/graphql", graphqlController.proxyGraphQL);
  createPostRoute("/api/anilist/oauth/token", anilistOAuthController.exchangeToken);
  createPostRoute("/api/mal/oauth/token", malOAuthController.exchangeToken);

  // MAL proxy catch-all
  app.all("/api/mal/*", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    try {
      await malProxyController.proxyMALAPI(req, res);
    } catch (err) {
      console.error("Error in MAL proxy route:", err);
      if (!res.headersSent) return res.status(500).json({ error: err.message || "Internal server error" });
    }
  });
};
