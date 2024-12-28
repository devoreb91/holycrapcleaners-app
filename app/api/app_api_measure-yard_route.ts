import { NextResponse } from 'next/server'
import axios from 'axios'

// API key should be without the 'key=' prefix
const GOOGLE_MAPS_API_KEY = 'AIzaSyD9axfPLt0DlFk6pRqYrXE-qZPCDDF4bck'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  try {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    const geocodeResponse = await axios.get(geocodeUrl)
    
    if (geocodeResponse.data.status !== 'OK') {
      console.error('Geocoding API error:', geocodeResponse.data)
      return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
    }

    const location = geocodeResponse.data.results[0].geometry.location

    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=20&size=600x400&maptype=satellite&key=${GOOGLE_MAPS_API_KEY}`

    const yardSize = Math.floor(Math.random() * 5000) + 1000
    const classification = yardSize < 2500 ? 'Small' : yardSize < 5000 ? 'Medium' : 'Large'

    return NextResponse.json({
      yardScreenshot: staticMapUrl,
      yardSize: yardSize,
      yardClassification: classification
    })
  } catch (error) {
    console.error('Error measuring yard:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data)
    }
    return NextResponse.json({ error: "Failed to measure yard" }, { status: 500 })
  }
}

