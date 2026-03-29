import { Router } from "express";
import {
  getMessages,
  incrementMessageCount,
} from "../../services/messages.service.js";

export const messageRouter = Router();

messageRouter.get("/", (req, res) => {
  const messages = getMessages();
  res.json(messages);
});

messageRouter.post("/increment", (req, res) => {
  const updated = incrementMessageCount();
  res.json({
    message: "Contador actualizado",
    count: updated,
  });
});
