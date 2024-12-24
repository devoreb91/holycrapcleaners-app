import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'

interface YardMapProps {
  map: google.maps.Map | null
}

export default function YardMap({ map }: YardMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    if (map && mapRef.current) {
      map.setOptions({ 
        center: { lat: 39.9783, lng: -86.1180 }, 
        zoom: 14,
        mapTypeId: 'satellite'
      });
      // Add a listener to know when the map is fully loaded
      google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
        setMapLoading(false);
      });
    }
  }, [map]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {mapLoading && <p>Loading map...</p>}
      <div 
        id="map" 
        ref={mapRef} 
        className="w-full h-96 rounded-lg"
        aria-label="Google Map"
      />
    </Card>
  )
}

