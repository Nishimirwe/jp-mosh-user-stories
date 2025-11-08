import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { GeoJsonNetwork } from '../../../types';
import { NetworkType } from '../../../types';
import 'leaflet/dist/leaflet.css';
import './NetworkMap.css';

interface NetworkMapProps {
  networks: GeoJsonNetwork[];
  selectedNetwork: string | null;
}

export function NetworkMap({ networks, selectedNetwork }: NetworkMapProps) {
  // Default center (New York) - will be dynamic based on city
  const center: [number, number] = [40.7128, -74.006];

  const getNetworkStyle = (network: GeoJsonNetwork) => {
    const isSelected = network._id === selectedNetwork;
    return {
      color: network.type === NetworkType.BIKING ? '#4CAF50' : '#2196F3',
      weight: isSelected ? 5 : 3,
      opacity: isSelected ? 1 : 0.7,
    };
  };

  return (
    <div className="network-map-container">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {networks.map((network) => (
          network.geojson && (
            <GeoJSON
              key={network._id}
              data={network.geojson}
              style={() => getNetworkStyle(network)}
            />
          )
        ))}
      </MapContainer>
      {networks.length === 0 && (
        <div className="map-empty-state">
          <p>No networks to display</p>
          <span>Add networks to see them on the map</span>
        </div>
      )}
    </div>
  );
}
