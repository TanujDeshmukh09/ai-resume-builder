const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODEL = "anthropic/claude-3-haiku";

/**
 * AIChatSession mimics the Gemini SDK's chat session interface.
 * Usage: 
 *   const result = await AIChatSession.sendMessage(prompt);
 *   const text = result.response.text();
 *
 * NOTE: History is cleared before each call because all resume prompts
 * are standalone (not multi-turn conversations). Keeping history caused
 * the context to bloat and the model to return truncated/partial responses.
 */
export const AIChatSession = {
  async sendMessage(prompt) {
    // Fresh messages array each time — no accumulated history bloat
    const messages = [{ role: "user", content: prompt }];

    const response = await fetch(OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": import.meta.env.VITE_BASE_URL || "http://localhost:5173",
        "X-Title": "AI Resume Builder",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
        // ❌ Do NOT use response_format: json_object — it forces a single object
        // and breaks JSON array responses (causes truncation to 1 item)
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`OpenRouter error: ${err?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Return an object matching the Gemini SDK's response shape
    return {
      response: {
        text: () => assistantMessage,
      },
    };
  },
};
