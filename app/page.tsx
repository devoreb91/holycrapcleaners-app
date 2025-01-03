'use client';

import { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import YardMap from './components/YardMap';
import AddressInput from './components/AddressInput';
import YardInfo from './components/YardInfo';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9axfPLt0DlFk6pRqYrXE-qZPCDDF4bck';

export default function Home() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [yardSize, setYardSize] = useState<string>('Medium');
  const [yardClassification, setYardClassification] = useState<string | null>(null);
  const [yardScreenshot, setYardScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [address, setAddress] = useState<string>('123 Main Street');
  const [isOneTimeService, setIsOneTimeService] = useState<boolean>(true);
  const [dogs, setDogs] = useState<number>(1);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["drawing", "geometry"]
        });

        await loader.load();

        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps failed to load');
        }

        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: { lat: 39.9783, lng: -86.1180 },
          zoom: 14,
          mapTypeId: 'satellite'
        });
        setMap(map);
        setError(null);
        setMapLoading(false);
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        setError('Failed to load Google Maps. Please check your API key configuration.');
        setMapLoading(false);
      }
    };

    initializeMap();
  }, []);

  const measureYard = async (newAddress: string) => {
    try {
      setLoading(true);
      setError(null);
      setAddress(newAddress);

      const response = await fetch(`/api/measure-yard?address=${encodeURIComponent(newAddress)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while measuring the yard');
      }

      setYardSize(data.yardSize || 'Medium');
      setYardClassification(data.yardClassification);
      setYardScreenshot(data.yardScreenshot);
    } catch (error) {
      console.error('Error measuring yard:', error);
      setError('An error occurred while measuring the yard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Yard Measurement Tool</h1>
      <AddressInput onMeasure={measureYard} loading={loading} />
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {mapLoading && !error && (
        <div className="w-full max-w-4xl mx-auto h-96 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <YardMap 
        address={address}
        isOneTimeService={isOneTimeService}
        dogs={dogs}
        yardSize={yardSize}
      />
      <YardInfo yardSize={yardSize} yardClassification={yardClassification} />
      {yardScreenshot && (
        <img 
          src={yardScreenshot} 
          alt="Yard Screenshot" 
          className="mt-8 w-full max-w-2xl rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}
