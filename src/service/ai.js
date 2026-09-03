export const getBloomResponse = async (userFeeling, userHistory = '') => {
  const prompt = `
    You are Bloom, a gentle, warm companion who helps people understand their feelings.
    
    The user shared: "${userFeeling}"
    Previous history: ${userHistory || 'First visit'}
    
    Respond as Bloom with:
    1. A warm, empathetic acknowledgment
    2. A gentle reflection (not advice, just presence)
    3. One short, open-ended question to understand them better
    
    Keep it under 3 sentences. Be warm, not clinical.
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are Bloom, a gentle, warm companion.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 100,
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};