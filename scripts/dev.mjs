import { spawn } from "node:child_process";

const nodeCommand = process.execPath;
const locationApi = spawn(nodeCommand, ["server/locations-api.mjs"], { stdio: "inherit" });
const vite = spawn(nodeCommand, ["node_modules/vite/bin/vite.js"], { stdio: "inherit" });

const stop = () => {
  locationApi.kill();
  vite.kill();
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
locationApi.on("exit", (code) => {
  if (code && code !== 0) process.exitCode = code;
});
vite.on("exit", (code) => {
  stop();
  process.exitCode = code ?? 0;
});
