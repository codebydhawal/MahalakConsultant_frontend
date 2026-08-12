import { spawn } from "node:child_process";

const nodeCommand = process.execPath;
const vite = spawn(nodeCommand, ["node_modules/vite/bin/vite.js"], { stdio: "inherit" });

const stop = () => {
  vite.kill();
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
vite.on("exit", (code) => {
  stop();
  process.exitCode = code ?? 0;
});
