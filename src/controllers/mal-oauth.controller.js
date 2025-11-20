import axios from "axios";

export const exchangeToken = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Convert JSON body to URLSearchParams format for MAL API
    const formData = new URLSearchParams();
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });
    
    const response = await axios.post('https://myanimelist.net/v1/oauth2/token', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      validateStatus: () => true // Don't throw on any status
    });

    const data = response.data;
    
    if (!response.status || response.status >= 400) {
      return res.status(response.status || 500).json(data);
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('MAL OAuth error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
