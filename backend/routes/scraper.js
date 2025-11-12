import express from "express";
import { scrapeCocoonMarket } from "../controllers/scraperController.js";

const router = express.Router();

router.get("/cocoon", scrapeCocoonMarket);

export default router;
