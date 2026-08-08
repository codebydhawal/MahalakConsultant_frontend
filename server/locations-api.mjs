import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const cacheFile = process.env.DATA_FILE || join(here, "data", "countries-states-cities.json");
const sourceUrl = process.env.DATA_URL ||
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries+states+cities.json";
const port = Number(process.env.LOCATIONS_API_PORT || 3001);
const cacheHours = Number(process.env.CACHE_HOURS || 24);

let data;
let loadedAt = 0;
let loading;

async function getLocations() {
  if (data && Date.now() - loadedAt < cacheHours * 3_600_000) return data;
  if (loading) return loading;

  loading = (async () => {
    try {
      const cacheIsFresh = existsSync(cacheFile) &&
        Date.now() - (await stat(cacheFile)).mtimeMs < cacheHours * 3_600_000;

      if (cacheIsFresh) {
        data = JSON.parse(await readFile(cacheFile, "utf8"));
      } else {
        const response = await fetch(sourceUrl, {
          headers: { "user-agent": "mahalak-locations-api/1.0" },
        });
        if (!response.ok) throw new Error(`Data download failed (${response.status})`);
        const raw = await response.text();
        data = JSON.parse(raw);
        await mkdir(dirname(cacheFile), { recursive: true });
        await writeFile(cacheFile, raw, "utf8");
      }

      loadedAt = Date.now();
      return data;
    } finally {
      loading = undefined;
    }
  })();

  return loading;
}

function send(res, status, body, acceptEncoding = "") {
  const json = JSON.stringify(body);
  const compressed = /\bgzip\b/.test(String(acceptEncoding));
  const payload = compressed ? gzipSync(json) : Buffer.from(json);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": payload.length,
    "cache-control": "public, max-age=3600",
    "access-control-allow-origin": "*",
    ...(compressed ? { "content-encoding": "gzip" } : {}),
  });
  res.end(payload);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type",
    });
    return res.end();
  }

  if (req.method !== "GET" || url.pathname !== "/api/locations") {
    return send(res, 404, { error: "Use GET /api/locations" }, req.headers["accept-encoding"]);
  }

  try {
    const countries = await getLocations();
    return send(res, 200, { count: countries.length, countries }, req.headers["accept-encoding"]);
  } catch (error) {
    return send(res, 503, {
      error: "Worldwide location data is not available yet.",
      detail: error instanceof Error ? error.message : "Unknown error",
    }, req.headers["accept-encoding"]);
  }
});

server.listen(port, () => {
  console.log(`Locations API listening on http://localhost:${port}/api/locations`);
});
