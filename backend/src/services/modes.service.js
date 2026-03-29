import fs from "fs";

const modesFile = new URL("../db/modes.json", import.meta.url);

export const getAllModes = () => {
  return JSON.parse(fs.readFileSync(modesFile, "utf8"));
};
