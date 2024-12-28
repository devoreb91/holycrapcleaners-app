export async function GET() { return Response.json({ BACKEND_API_URL: process.env.BACKEND_API_URL, GOOGLE_API_KEY: process.env.GOOGLE_API_KEY }); } 
