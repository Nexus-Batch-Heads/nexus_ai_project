require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

async function test() {
  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [{ role: 'user', content: 'hello' }]
    });
    console.log('SUCCESS:', response.choices[0].message.content);
  } catch (error) {
    console.log('MSG_ERROR:', error.message);
  }
}

test();
