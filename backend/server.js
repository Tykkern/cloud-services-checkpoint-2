const http = require("http");
const os = require("os");

const port = Number(process.env.PORT || 3000);
const greeting = process.env.GREETING || "Привет";
const appEnv = process.env.APP_ENV || "local";
const apiToken = process.env.API_TOKEN || "";

// Сам токен наружу не отдаём, только признак, что Secret подключён
function maskToken(token) {
  if (!token) return null;
  return token.slice(0, 2) + "***" + token.slice(-2);
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer((req, res) => {
  const path = req.url.split("?")[0];

  if (path === "/api/health") {
    return sendJson(res, 200, { status: "ok" });
  }

  if (path === "/api" || path === "/api/") {
    return sendJson(res, 200, {
      service: "backend",
      greeting,
      env: appEnv,
      apiToken: maskToken(apiToken),
      pod: os.hostname(),
      time: new Date().toISOString(),
    });
  }

  sendJson(res, 404, { error: "not found", path });
});

server.listen(port, () => {
  console.log(`backend listening on ${port}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
