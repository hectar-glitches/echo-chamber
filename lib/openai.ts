
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizeMemory(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Summarize the following memory in one sentence.' },
        { role: 'user', content },
      ],
      max_tokens: 60,
    });
    return response.choices[0].message?.content || '';
  } catch (error) {
    return '';
  }
}
