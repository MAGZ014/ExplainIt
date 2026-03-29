import { Router } from "express";
import { getAllModes } from "../../services/modes.service.js";

export const modesRouter = Router();

modesRouter.get("/", (req, res) => {
  const modes = getAllModes();
  res.json(modes);
});
