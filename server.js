import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./src/App.js";

const app = express();

// Statik dosyaları sunmak için "public" klasörünü kullan
app.use(express.static("public"));

app.get("*", (req, res) => {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url}>
      <App location={req.url} />
    </StaticRouter>
  );

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>React SSR with Express</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div id="root">${html}</div>
    </body>
    </html>
  `);
});

// Sunucuyu başlat
app.listen(3000, () =>
  console.log("🚀 Server is running on http://localhost:3000")
);
