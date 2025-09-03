import type { NextApiRequest, NextApiResponse } from 'next';

// ЗАГЛУШКА: Прокси к внешнему TTS API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { text, voice } = req.body;
  const apiKey = process.env.TTS_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'TTS API key is not configured.' });
  }
  if (!text) {
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    // Здесь будет реальный запрос к внешнему API
    res.status(501).json({ message: 'TTS service not implemented. Add API Key.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
