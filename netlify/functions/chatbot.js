export async function handler(event, context) {
  try {
    const { message } = JSON.parse(event.body || '{}');
    if (!message) return { statusCode: 400, body: JSON.stringify({ reply: "Message vide" }) };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // plus compatible
        messages: [
          { role: 'system', content: 'Tu es un assistant commercial pour une agence web premium à Crans-Montana. Réponds uniquement en texte clair et professionnel.' },
          { role: 'user', content: message }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();
    console.log("Réponse OpenAI complète :", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]?.message?.content) {
      return { statusCode: 500, body: JSON.stringify({ reply: "Erreur API OpenAI ou clé invalide" }) };
    }

    const reply = data.choices[0].message.content;
    return { statusCode: 200, body: JSON.stringify({ reply }) };

  } catch (err) {
    console.error("Erreur fonction chatbot :", err);
    return { statusCode: 500, body: JSON.stringify({ reply: "Erreur serveur. L'équipe vous répondra." }) };
  }
}
