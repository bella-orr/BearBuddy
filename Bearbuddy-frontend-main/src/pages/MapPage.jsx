import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';

const UC_CENTER = {
  lat: 39.1329,
  lng: -84.5150,
};

export default function MapPage() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <section className="page">
      <h1>Map</h1>

      <div
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px',
        }}
      >
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={UC_CENTER}
              defaultZoom={16}
              gestureHandling="greedy"
              disableDefaultUI={false}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </APIProvider>
        ) : (
          <p>Google Maps API key is missing.</p>
        )}
      </div>

      <Link
        to={ROUTES.ROUTE}
        className="btn btn-primary"
      >
        Preview route
      </Link>
    </section>
  );
}
