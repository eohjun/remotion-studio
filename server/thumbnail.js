/**
 * Thumbnail Generation Server
 *
 * Simple HTTP server for thumbnail generation on-demand.
 *
 * Usage:
 *   node server/thumbnail.js
 *
 * API:
 *   GET /thumbnail?title=My+Video&primaryColor=%23667eea
 *
 * Query Parameters:
 *   - title: Main title text (required)
 *   - subtitle: Subtitle text (optional)
 *   - primaryColor: Primary color hex (default: #667eea)
 *   - secondaryColor: Secondary color hex (default: #764ba2)
 *   - backgroundStyle: gradient | solid | dark (default: gradient)
 *   - showLogo: true | false (default: true)
 *   - titleSize: small | medium | large (default: large)
 *   - icon: Emoji or icon (optional)
 *   - width: Image width (default: 1920)
 *   - height: Image height (default: 1080)
 *   - format: png | jpeg | webp (default: png)
 *
 * @example
 * // Generate a thumbnail
 * curl "http://localhost:3001/thumbnail?title=Hello&icon=👋" > thumb.png
 */

const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3001;

// Simple HTTP server for documentation
// For production, implement with Remotion's bundle() and renderStill()
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || "", true);

  if (parsedUrl.pathname === "/thumbnail") {
    const query = parsedUrl.query;

    // Extract parameters
    const props = {
      title: query.title || "Video Title",
      subtitle: query.subtitle,
      primaryColor: query.primaryColor || "#667eea",
      secondaryColor: query.secondaryColor || "#764ba2",
      backgroundStyle: query.backgroundStyle || "gradient",
      showLogo: query.showLogo !== "false",
      titleSize: query.titleSize || "large",
      icon: query.icon,
    };

    const width = parseInt(query.width, 10) || 1920;
    const height = parseInt(query.height, 10) || 1080;
    const format = query.format || "png";

    // Return placeholder response (actual implementation needs Remotion bundle)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Thumbnail server is running",
        instructions: [
          "To generate an actual thumbnail:",
          "1. Use CLI: npx remotion still Thumbnail --props='{...}' output.png",
          "2. Or implement renderStill with Remotion's bundled project",
        ],
        requestedProps: props,
        dimensions: { width, height },
        format,
        cliExample: `npx remotion still Thumbnail --props='${JSON.stringify(props)}' thumbnail.png`,
      })
    );
    return;
  }

  // Health check
  if (parsedUrl.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  // API documentation
  if (parsedUrl.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Thumbnail Server</title>
          <style>
            body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
            pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>🎬 Thumbnail Generation Server</h1>
          <p>Generate video thumbnails on-demand using Remotion.</p>

          <h2>Quick Start (CLI)</h2>
          <pre>npx remotion still Thumbnail --props='{"title":"My Video","icon":"🚀"}' thumbnail.png</pre>

          <h2>API Endpoints</h2>
          <ul>
            <li><code>GET /thumbnail</code> - Get thumbnail generation info</li>
            <li><code>GET /health</code> - Health check</li>
          </ul>

          <h2>Query Parameters</h2>
          <ul>
            <li><code>title</code> - Main title text (required)</li>
            <li><code>subtitle</code> - Subtitle text</li>
            <li><code>primaryColor</code> - Primary color hex (default: #667eea)</li>
            <li><code>secondaryColor</code> - Secondary color hex (default: #764ba2)</li>
            <li><code>backgroundStyle</code> - gradient | solid | dark</li>
            <li><code>showLogo</code> - true | false</li>
            <li><code>titleSize</code> - small | medium | large</li>
            <li><code>icon</code> - Emoji or icon</li>
          </ul>
        </body>
      </html>
    `);
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`🎬 Thumbnail server running at http://localhost:${PORT}`);
  console.log(`📖 API docs at http://localhost:${PORT}/`);
  console.log("");
  console.log("To generate a thumbnail via CLI:");
  console.log("  npx remotion still Thumbnail --props='{\"title\":\"My Video\"}' thumbnail.png");
});
