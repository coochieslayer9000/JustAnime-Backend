import axios from "axios";

export const exchangeToken = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.post('https://anilist.co/api/v2/oauth/token', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      validateStatus: () => true // Don't throw on any status
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('AniList OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
