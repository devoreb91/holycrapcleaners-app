'use client';

import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface YardMapProps {
  address: string;
  isOneTimeService: boolean; // Toggle between one-time or recurring service
  dogs: number;
  timeSinceLastCleanup?: string; // Only for one-time cleanup
  yardSize: string;
}

const YardMap: React.FC<YardMapProps> = ({
  address,
  isOneTimeService,
  dogs,
  timeSinceLastCleanup,
  yardSize,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [yardSizeLabel, setYardSizeLabel] = useState<string>('Detecting yard size...');
  const [areaInAcres, setAreaInAcres] = useState<number | null>(null);
  const [yardPrice, setYardPrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.GOOGLE_FRONTEND_API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'geometry', 'marker'],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 39.7601, lng: -86.1639 }, // Lucas Oil Stadium Coordinates
          zoom: 17,
          mapTypeId: 'satellite',
          mapId: process.env.GOOGLE_MAP_ID || '',
        });

        if (address) {
          setError(null); 
          setLoading(true);

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address }, async (results, status) => {
            if (status === 'OK' && results?.length > 0) {
              const location = results[0].geometry.location;
              map.setCenter(location);

              if (google.maps.marker?.AdvancedMarkerElement) {
                new google.maps.marker.AdvancedMarkerElement({
                  position: location,
                  map,
                  title: 'Property Location',
                });
              } else {
                new google.maps.Marker({
                  position: location,
                  map,
                  title: 'Property Location',
                });
              }

              try {
                let county = 'hamilton';
                if (address.toLowerCase().includes('indianapolis')) {
                  county = 'marion';
                }

                const endpoint = isOneTimeService
                  ? `/api/one-time-pricing?dogs=${dogs}&timeSinceLastCleanup=${timeSinceLastCleanup}&yardSize=${yardSize}`
                  : `/api/get-parcel-${county}?lat=${location.lat()}&lng=${location.lng()}`;

                console.log(`Fetching parcel data from: ${endpoint}`);

                const response = await axios.get(endpoint);

                if (response.data?.lotSizeAcres !== undefined) {
                  const lotSizeAcres = parseFloat(response.data.lotSizeAcres) || 0;
                  setAreaInAcres(lotSizeAcres);

                  let price = 0;
                  let sizeClassification = '';

                  if (lotSizeAcres < 0.12) {
                    sizeClassification = 'Small Yard';
                    price = 3.99;
                  } else if (lotSizeAcres <= 0.23) {
                    sizeClassification = 'Medium Yard';
                    price = 6.99;
                  } else if (lotSizeAcres <= 0.3) {
                    sizeClassification = 'Large Yard';
                    price = 9.99;
                  } else {
                    sizeClassification = 'Extra Large Yard';
                    price = 12.99;
                  }

                  setYardSizeLabel(sizeClassification);
                  setYardPrice(`$${price.toFixed(2)} per month`);
                } else {
                  setError('Yard size data unavailable');
                  setYardSizeLabel('Yard size data unavailable');
                }
              } catch (error) {
                console.error('Failed to fetch parcel data:', error);
                setError('Error fetching parcel data from the server.');
                setYardSizeLabel('Unable to fetch yard data.');
              } finally {
                setLoading(false); 
              }
            } else {
              setError('Failed to geocode address.');
              setYardSizeLabel('Unable to geocode address.');
              setLoading(false); 
            }
          });
        }
      }
    });
  }, [address, isOneTimeService, dogs, timeSinceLastCleanup, yardSize]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      />

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '48px', animation: 'bounce 1.5s infinite' }}>💩</div>
          <p style={{ marginTop: '10px', fontSize: '16px' }}>Fetching yard data... Please wait!</p>
        </div>
      )}

      {!loading && (
        <>
          <h3>Yard Size: {yardSizeLabel}</h3>
          {areaInAcres !== null && <h4>Exact Lot Size: {areaInAcres.toFixed(2)} acres</h4>}
          {yardPrice && <h4>Yard Size Price: {yardPrice}</h4>}
          {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
        </>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default YardMap;

