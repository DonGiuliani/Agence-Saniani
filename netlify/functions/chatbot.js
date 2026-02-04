import fetch from 'node-fetch';

export async function handler(event, context) {
  const { message } = JSON.parse(event.body || '{}');
  if (!message) return { statusCode: 400, body: JSON.stringify({ reply: "Message vide" }) };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un assistant commercial pour une agence web premium à Crans-Montana.' },
          { role: 'user', content: message }
        ],
        temperature: 0.6
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Je n'ai pas de réponse.";
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ reply: "Erreur serveur. L'équipe vous répondra." }) };
  }
}
