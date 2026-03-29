import fs from "fs";

const messagesFile = new URL("../db/messages.json", import.meta.url);

const readDB = () => JSON.parse(fs.readFileSync(messagesFile, "utf8"));

const writeDB = (data) =>
  fs.writeFileSync(messagesFile, JSON.stringify(data, null, 2), "utf8");

export const getMessages = () => {
  return readDB();
};

export const incrementMessageCount = () => {
  const messages = readDB();

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages DB is not initialized");
  }

  messages[0].count += 1;
  writeDB(messages);

  return messages[0].count;
};
