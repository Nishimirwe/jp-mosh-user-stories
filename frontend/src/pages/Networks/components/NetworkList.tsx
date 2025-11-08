import type { GeoJsonNetwork } from '../../../types';
import { NetworkType } from '../../../types';
import './NetworkList.css';

interface NetworkListProps {
  networks: GeoJsonNetwork[];
  selectedNetwork: string | null;
  onSelectNetwork: (id: string) => void;
}

export function NetworkList({ networks, selectedNetwork, onSelectNetwork }: NetworkListProps) {
  const bikingCount = networks.filter(n => n.type === NetworkType.BIKING).length;
  const transitCount = networks.filter(n => n.type === NetworkType.TRANSIT).length;

  return (
    <div className="network-list">
      <div className="network-list-header">
        <h2>Networks</h2>
        <div className="network-counts">
          <span className="count-badge biking">{bikingCount} 🚴</span>
          <span className="count-badge transit">{transitCount} 🚇</span>
        </div>
      </div>

      <div className="network-items">
        {networks.length === 0 ? (
          <div className="empty-list">
            <p>No networks available</p>
            <span>Networks will appear here when added</span>
          </div>
        ) : (
          networks.map((network) => (
            <div
              key={network._id}
              className={`network-card ${selectedNetwork === network._id ? 'selected' : ''}`}
              onClick={() => onSelectNetwork(network._id)}
            >
              <div
                className="network-icon"
                style={{
                  backgroundColor: network.type === NetworkType.BIKING ? '#E8F5E9' : '#E3F2FD',
                  color: network.type === NetworkType.BIKING ? '#4CAF50' : '#2196F3'
                }}
              >
                {network.type === NetworkType.BIKING ? '🚴' : '🚇'}
              </div>
              <div className="network-info">
                <h3>{network.name}</h3>
                <div className="network-meta">
                  <span className={`network-type ${network.type.toLowerCase()}`}>
                    {network.type}
                  </span>
                  {network.isBaseline && (
                    <span className="baseline-badge">Baseline</span>
                  )}
                </div>
                <span className="network-date">
                  Updated: {new Date(network.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
