import { useState } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from '@vis.gl/react-google-maps';

import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { pathInterruptions } from '../data/pathInterruptions.js';

const UC_CENTER = {
  lat: 39.1329,
  lng: -84.5150,
};

// Select the correct icon for each interruption type
function getMarkerIcon(type) {
  let iconPath;

  switch (type) {
    case 'Construction':
      iconPath = '/icons/construction.svg';
      break;

    case 'Accessibility Issue':
      iconPath = '/icons/accessibility.svg';
      break;

    case 'Other Hazard':
      iconPath = '/icons/warning.svg';
      break;

    case 'Closed Road':
      // Keep the existing red road closure symbol
      return {
        url:
          'data:image/svg+xml;charset=UTF-8,' +
          encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20"
                      fill="#DC2626"
                      stroke="white"
                      stroke-width="3"/>
              <rect x="11" y="18"
                    width="22" height="8"
                    rx="2" fill="white"/>
            </svg>
          `),
      };

    default:
      return undefined;
  }

  return {
    url: iconPath,
  };

}

function CampusMap() {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <Map
      defaultCenter={UC_CENTER}
      defaultZoom={16}
      gestureHandling="greedy"
      disableDefaultUI={false}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {/* Display interruption markers */}
      {pathInterruptions.map((report) => (
        <Marker
          key={report.id}
          position={{
            lat: report.latitude,
            lng: report.longitude,
          }}
          title={`${report.type} - Test Report`}
          icon={getMarkerIcon(report.type)}
          onClick={() => setSelectedReport(report)}
        />
      ))}

      {/* Show details when a marker is clicked */}
      {selectedReport && (
        <InfoWindow
          position={{
            lat: selectedReport.latitude,
            lng: selectedReport.longitude,
          }}
          onCloseClick={() => setSelectedReport(null)}
        >
          <div
            style={{
              color: '#222',
              maxWidth: '220px',
            }}
          >
            <h3>{selectedReport.type}</h3>

            <p>{selectedReport.description}</p>

            <p>
              <strong>Status:</strong>{' '}
              {selectedReport.status}
            </p>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

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
            <CampusMap />
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