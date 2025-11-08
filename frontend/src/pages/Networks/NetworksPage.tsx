import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNetworks } from '../../hooks/useNetworks';
import { NetworkMap } from './components/NetworkMap';
import { NetworkList } from './components/NetworkList';
import { NetworkType } from '../../types';
import './NetworksPage.css';

export function NetworksPage() {
  const { user } = useAuthStore();
  const { data: networks, isLoading } = useNetworks(user?.cityId || '');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [showBiking, setShowBiking] = useState(true);
  const [showTransit, setShowTransit] = useState(true);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading networks...</div>
      </div>
    );
  }

  const filteredNetworks = networks?.filter(network => {
    if (network.type === NetworkType.BIKING && !showBiking) return false;
    if (network.type === NetworkType.TRANSIT && !showTransit) return false;
    return true;
  }) || [];

  return (
    <div className="networks-page">
      <header className="networks-header">
        <h1>Transportation Networks</h1>
        <div className="layer-toggles">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showBiking}
              onChange={(e) => setShowBiking(e.target.checked)}
            />
            <span style={{ color: '#4CAF50' }}>🚴 Biking Networks</span>
          </label>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showTransit}
              onChange={(e) => setShowTransit(e.target.checked)}
            />
            <span style={{ color: '#2196F3' }}>🚇 Transit Networks</span>
          </label>
        </div>
      </header>

      <div className="networks-content">
        <NetworkList
          networks={filteredNetworks}
          selectedNetwork={selectedNetwork}
          onSelectNetwork={setSelectedNetwork}
        />
        <NetworkMap
          networks={filteredNetworks}
          selectedNetwork={selectedNetwork}
        />
      </div>
    </div>
  );
}
