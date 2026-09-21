const FALLBACK_RESPONSES = [
  "Thank you for sharing that. It takes something to put it into words. I'm here with you.",
  "I hear you. That's real, and it matters. You don't have to carry it alone.",
  "That's a lot to hold. Thank you for trusting me with it. Let's sit with this together.",
  "I don't have answers for you. But I have presence, and I'm right here.",
];

function pickFallback() {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

function hasUsableKey() {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  return Boolean(key) && key !== "your-api-key-here";
}

const SYSTEM_PROMPT = `
You are Bloom, a warm, grounded wellbeing companion — not a therapist, and never a
diagnostic tool. You help someone notice how they're actually doing, in an ongoing,
natural conversation, not a one-off script.

Rules you always follow:
- Never diagnose a condition or use clinical/mental-health-diagnostic language.
- Never claim certainty about how someone feels. Their words are a signal, not a verdict.
- Never guilt, shame, or imply the person is failing, behind, or not trying hard enough.
- If a conversation snippet is provided, respond to what they just said specifically —
  don't repeat your first message or restart the conversation.
- Keep it to 2-3 sentences: a genuine acknowledgment, a grounded reflection (not advice
  unless asked), and, when it fits naturally, one short open question.
- If someone describes something serious or urgent, gently encourage them to reach out
  to a person or professional who can actually help — don't try to handle it yourself.
`;

/**
 * Ask Bloom's AI layer for the next line in an ongoing conversation.
 *
 * Uses Groq's OpenAI-compatible endpoint. Safety-relevant judgment stays in
 * service/signals.js — this function only shapes tone and continuity.
 *
 * Never throws. If there's no key or the request fails, falls back to a
 * canned response so the app never breaks mid-conversation.
 */
export async function getBloomResponse(userMessage, context = "") {
  if (!hasUsableKey()) {
    return pickFallback();
  }

  const userPrompt = `
    Context (recent pattern and/or conversation so far — may be empty): ${context || "None yet."}

    The person just said: "${userMessage}"

    Respond as Bloom, following your rules.
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Bloom AI failed:", response.status, errBody);
      return pickFallback();
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || pickFallback();
  } catch (err) {
    console.error("Bloom AI threw:", err);
    return pickFallback();
  }
  
}