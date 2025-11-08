# MOSH Frontend Implementation Guide

## ✅ Completed

### Dependencies Installed
```bash
✅ react-leaflet
✅ leaflet
✅ @types/leaflet
✅ recharts
✅ react-hook-form
✅ zod
✅ @tanstack/react-query
```

### Services Created
✅ `src/services/networks.service.ts` - Network CRUD operations
✅ `src/services/simulations.service.ts` - Simulation CRUD operations
✅ `src/services/reports.service.ts` - Reports retrieval
✅ `src/hooks/useNetworks.ts` - React Query hooks for networks
✅ `src/main.tsx` - React Query Provider setup

---

## 🔄 Next: Implement These Files

### 1. Networks Page - GeoJSON Viewer

#### File: `src/pages/Networks/NetworksPage.tsx`
```typescript
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNetworks } from '../../hooks/useNetworks';
import { NetworkMap } from './components/NetworkMap';
import { NetworkList } from './components/NetworkList';
import './NetworksPage.css';

export function NetworksPage() {
  const { user } = useAuthStore();
  const { data: networks, isLoading } = useNetworks(user?.cityId || '');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [showBiking, setShowBiking] = useState(true);
  const [showTransit, setShowTransit] = useState(true);

  if (isLoading) return <div>Loading networks...</div>;

  const filteredNetworks = networks?.filter(network => {
    if (network.type === 'BIKING' && !showBiking) return false;
    if (network.type === 'TRANSIT' && !showTransit) return false;
    return true;
  }) || [];

  return (
    <div className="networks-page">
      <header className="networks-header">
        <h1>Transportation Networks</h1>
        <div className="layer-toggles">
          <label>
            <input
              type="checkbox"
              checked={showBiking}
              onChange={(e) => setShowBiking(e.target.checked)}
            />
            Biking Networks
          </label>
          <label>
            <input
              type="checkbox"
              checked={showTransit}
              onChange={(e) => setShowTransit(e.target.checked)}
            />
            Transit Networks
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
```

#### File: `src/pages/Networks/NetworksPage.css`
```css
.networks-page {
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
}

.networks-header {
  background: var(--color-white);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-neutral-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.networks-header h1 {
  margin: 0;
  color: var(--color-primary-700);
}

.layer-toggles {
  display: flex;
  gap: 2rem;
}

.layer-toggles label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.networks-content {
  flex: 1;
  display: grid;
  grid-template-columns: 350px 1fr;
  overflow: hidden;
}
```

#### File: `src/pages/Networks/components/NetworkMap.tsx`
```typescript
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { GeoJsonNetwork } from '../../../types';
import 'leaflet/dist/leaflet.css';
import './NetworkMap.css';

interface NetworkMapProps {
  networks: GeoJsonNetwork[];
  selectedNetwork: string | null;
}

export function NetworkMap({ networks, selectedNetwork }: NetworkMapProps) {
  // Default center (will be replaced with city center)
  const center: [number, number] = [40.7128, -74.006];

  const getNetworkStyle = (network: GeoJsonNetwork) => {
    const isSelected = network._id === selectedNetwork;
    const baseStyle = {
      color: network.type === 'BIKING' ? '#4CAF50' : '#2196F3',
      weight: isSelected ? 4 : 2,
      opacity: isSelected ? 1 : 0.7,
    };
    return baseStyle;
  };

  return (
    <div className="network-map-container">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {networks.map((network) => (
          <GeoJSON
            key={network._id}
            data={network.geojson}
            style={() => getNetworkStyle(network)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
```

#### File: `src/pages/Networks/components/NetworkList.tsx`
```typescript
import { GeoJsonNetwork } from '../../../types';
import './NetworkList.css';

interface NetworkListProps {
  networks: GeoJsonNetwork[];
  selectedNetwork: string | null;
  onSelectNetwork: (id: string) => void;
}

export function NetworkList({ networks, selectedNetwork, onSelectNetwork }: NetworkListProps) {
  return (
    <div className="network-list">
      <h2>Networks ({networks.length})</h2>
      <div className="network-items">
        {networks.map((network) => (
          <div
            key={network._id}
            className={`network-card ${selectedNetwork === network._id ? 'selected' : ''}`}
            onClick={() => onSelectNetwork(network._id)}
          >
            <div className="network-icon" style={{
              backgroundColor: network.type === 'BIKING' ? '#E8F5E9' : '#E3F2FD'
            }}>
              {network.type === 'BIKING' ? '🚴' : '🚇'}
            </div>
            <div className="network-info">
              <h3>{network.name}</h3>
              <span className="network-type">{network.type}</span>
              {network.isBaseline && <span className="baseline-badge">Baseline</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 2. Simulations Page - Create & Monitor

#### File: `src/pages/Simulations/SimulationsPage.tsx`
```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { simulationsService } from '../../services/simulations.service';
import { SimulationCard } from './components/SimulationCard';
import { UserRole } from '../../types';
import './SimulationsPage.css';

export function SimulationsPage() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: simulations, isLoading } = useQuery({
    queryKey: ['simulations', user?.cityId],
    queryFn: () => simulationsService.getAllSimulations(user?.cityId),
    refetchInterval: (data) => {
      // Auto-refresh if any simulation is running
      const hasRunning = data?.some(sim => sim.status === 'RUNNING');
      return hasRunning ? 5000 : false;
    },
  });

  const canCreateSimulation = user?.roles.some(role =>
    [UserRole.ADMIN, UserRole.PLANNER].includes(role)
  );

  const filtered = simulations?.filter(sim =>
    statusFilter === 'all' ? true : sim.status === statusFilter
  ) || [];

  return (
    <div className="simulations-page">
      <header className="page-header">
        <h1>Simulations</h1>
        {canCreateSimulation && (
          <Link to="/simulations/create">
            <button className="primary">Create Simulation</button>
          </Link>
        )}
      </header>

      <div className="filters">
        <button
          className={statusFilter === 'all' ? 'active' : ''}
          onClick={() => setStatusFilter('all')}
        >
          All
        </button>
        <button
          className={statusFilter === 'PENDING' ? 'active' : ''}
          onClick={() => setStatusFilter('PENDING')}
        >
          Pending
        </button>
        <button
          className={statusFilter === 'RUNNING' ? 'active' : ''}
          onClick={() => setStatusFilter('RUNNING')}
        >
          Running
        </button>
        <button
          className={statusFilter === 'COMPLETED' ? 'active' : ''}
          onClick={() => setStatusFilter('COMPLETED')}
        >
          Completed
        </button>
      </div>

      <div className="simulations-grid">
        {isLoading && <div>Loading simulations...</div>}
        {filtered.map(simulation => (
          <SimulationCard key={simulation._id} simulation={simulation} />
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="empty-state">
            <p>No simulations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### File: `src/pages/Simulations/components/SimulationCard.tsx`
```typescript
import { Link } from 'react-router-dom';
import { Simulation, SimulationStatus } from '../../../types';
import './SimulationCard.css';

interface SimulationCardProps {
  simulation: Simulation;
}

export function SimulationCard({ simulation }: SimulationCardProps) {
  const getStatusColor = (status: SimulationStatus) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'RUNNING': return 'blue';
      case 'COMPLETED': return 'green';
      case 'FAILED': return 'red';
    }
  };

  return (
    <div className="simulation-card">
      <div className="simulation-header">
        <h3>{simulation.name}</h3>
        <span className={`status-badge ${getStatusColor(simulation.status)}`}>
          {simulation.status}
        </span>
      </div>

      {simulation.description && (
        <p className="simulation-description">{simulation.description}</p>
      )}

      <div className="simulation-meta">
        <span>Created: {new Date(simulation.createdAt).toLocaleDateString()}</span>
      </div>

      {simulation.status === 'COMPLETED' && (
        <Link to={`/results/${simulation._id}`}>
          <button className="view-results">View Results</button>
        </Link>
      )}

      {simulation.status === 'RUNNING' && (
        <div className="progress-indicator">
          <div className="progress-bar"></div>
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
}
```

---

### 3. Update App.tsx with New Routes

#### File: `src/App.tsx` (Updated)
```typescript
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NetworksPage } from './pages/Networks/NetworksPage';
import { SimulationsPage } from './pages/Simulations/SimulationsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';

function App() {
  const { initialize, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/networks"
          element={
            <ProtectedRoute>
              <NetworksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulations"
          element={
            <ProtectedRoute>
              <SimulationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### 4. Update Dashboard with Navigation

#### File: `src/pages/Dashboard.tsx` (Update the quick actions)
```typescript
// Replace the actions-grid section with:
<div className="quick-actions">
  <h3>Quick Actions</h3>
  <div className="actions-grid">
    <Link to="/networks">
      <button className="action-button">View Networks</button>
    </Link>
    <Link to="/simulations">
      <button className="action-button">View Simulations</button>
    </Link>
    {(isAdmin || isPlanner) && (
      <>
        <Link to="/simulations/create">
          <button className="action-button">Create Simulation</button>
        </Link>
        <Link to="/networks/create">
          <button className="action-button">Create Network</button>
        </Link>
      </>
    )}
  </div>
</div>
```

---

## 📝 Remaining Tasks

### High Priority
- [ ] Complete Networks Page CSS files
- [ ] Create Simulation Creation Wizard
- [ ] Create Results Visualization Page
- [ ] Add Leaflet CSS import in index.css
- [ ] Test all pages with actual data

### Medium Priority
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Implement search/filtering
- [ ] Add export functionality
- [ ] Create comparison views

### Low Priority
- [ ] Add tooltips and help
- [ ] Implement onboarding tour
- [ ] Add performance monitoring
- [ ] Create admin pages

---

## 🎨 CSS Variables Reference

All pages should use these variables from `index.css`:

```css
--color-primary-600: #1E88E5  /* Main blue */
--color-primary-700: #1976D2  /* Dark blue */
--color-white: #FFFFFF
--color-neutral-50: #FAFAFA
--color-neutral-200: #EEEEEE
```

---

## 🚀 Testing Checklist

After implementation:
- [ ] Login works with test credentials
- [ ] Networks page loads and displays data
- [ ] Map renders correctly with networks
- [ ] Can toggle network layers
- [ ] Simulations page shows list
- [ ] Status updates automatically for RUNNING simulations
- [ ] Can navigate between all pages
- [ ] Role-based access control works
- [ ] Mobile responsive (basic)

---

**Status:** Services layer complete. UI components ready to build.
**Next Step:** Create the NetworksPage and components listed above.
