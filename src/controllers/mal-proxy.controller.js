import axios from "axios";

export const proxyMALAPI = async (req, res) => {
  const { method, headers, body } = req;
  
  // Extract the path after /api/mal/
  // e.g., /api/mal/users/@me/animelist -> /users/@me/animelist
  const apiPath = req.path.replace('/api/mal', '');
  
  // Construct the full MAL API URL with query parameters
  const queryString = new URLSearchParams(req.query).toString();
  const malApiUrl = `https://api.myanimelist.net/v2${apiPath}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const authHeader = headers.authorization || headers.Authorization;
    
    const fetchOptions = {
      method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JustAnime/1.0',
      },
      validateStatus: () => true // Don't throw on any status
    };

    // Add authorization header if present
    if (authHeader) {
      fetchOptions.headers['Authorization'] = authHeader;
    }
    
    // Handle different HTTP methods and body formats
    if (method === 'PATCH' || method === 'PUT') {
      fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      if (body && typeof body === 'object') {
        fetchOptions.data = new URLSearchParams(body).toString();
      } else if (body && typeof body === 'string') {
        fetchOptions.data = body;
      }
    } else if (method === 'POST' && body) {
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.data = body;
    }

    const response = await axios(malApiUrl, fetchOptions);
    
    let data;
    try {
      data = response.data;
    } catch {
      data = {};
    }
    
    if (!response.status || response.status >= 400) {
      return res.status(response.status || 500).json({
        error: `MAL API Error: ${response.statusText || 'Unknown error'}`,
        status: response.status,
        details: data
      });
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('MAL proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
