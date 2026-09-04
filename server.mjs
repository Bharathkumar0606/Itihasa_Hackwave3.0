import http from "node:http";

const port = Number(process.env.API_PORT || 8787);
const featherlessUrl = "https://api.featherless.ai/v1/chat/completions";
const model = process.env.FEATHERLESS_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct";

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") return sendJson(response, 204, {});
  if (request.method !== "POST" || request.url !== "/api/featherless/review") {
    return sendJson(response, 404, { error: "Not found" });
  }
  if (!process.env.FEATHERLESS_API_KEY) {
    return sendJson(response, 503, { error: "FEATHERLESS_API_KEY is not configured on the server." });
  }

  try {
    let rawBody = "";
    for await (const chunk of request) rawBody += chunk;
    const { placeName, localStory, state, mediaType } = JSON.parse(rawBody);
    if (!placeName?.trim() || !localStory?.trim()) {
      return sendJson(response, 400, { error: "placeName and localStory are required." });
    }

    const upstream = await fetch(featherlessUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are Itihasa's heritage submission review agent. Never claim historical truth. Return only valid JSON with status, category, moderationLabel, confidence, claims, missingEvidence, and publicNote. status must be AI Reviewed, Needs Evidence, or Rejected.",
          },
          {
            role: "user",
            content: JSON.stringify({
              task: "Classify and moderate this community heritage submission.",
              placeName,
              state,
              localStory,
              mediaType: mediaType || "none",
            }),
          },
        ],
      }),
    });

    const payload = await upstream.json();
    if (!upstream.ok) return sendJson(response, upstream.status, { error: payload.error?.message || "Featherless review failed." });
    const content = payload.choices?.[0]?.message?.content;
    if (!content) return sendJson(response, 502, { error: "Featherless returned no review content." });
    return sendJson(response, 200, { review: JSON.parse(content), model });
  } catch (error) {
    return sendJson(response, 500, { error: error.message || "Unable to complete Featherless review." });
  }
});

server.listen(port, () => console.log(`Featherless API proxy listening on http://localhost:${port}`));
