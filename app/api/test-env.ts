export default function handler(req, res) {
  res.status(200).json({
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    GOOGLE_FRONTEND_API_KEY: process.env.GOOGLE_FRONTEND_API_KEY,
    GOOGLE_MAP_ID: process.env.GOOGLE_MAP_ID,
  });
}
