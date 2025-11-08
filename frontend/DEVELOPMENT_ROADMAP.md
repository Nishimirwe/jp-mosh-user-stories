# MOSH Frontend Development Roadmap

## 🎯 Project Overview

**MOSH (Modal Shift World)** is a web-based platform designed to empower city planners and transportation authorities to simulate and evaluate the impact of proposed infrastructure and mobility projects.

### Key Objectives
- Reduce analysis time from **weeks to minutes**
- Enable **direct, data-driven** urban mobility planning
- Provide **interactive GeoJSON editing** for transit and biking networks
- Deliver **simulation results in under 15 minutes**
- Support **up to 20 users per city** with role-based access

---

## 📋 User Stories Reference

### Epic: Frontend Editing & Interface
- ✅ View baseline GeoJSON biking and transit networks
- 🔲 Edit baseline GeoJSON networks to test potential new projects
- 🔲 Undo and redo edits quickly to experiment without losing progress
- 🔲 Intuitive interface for minimal training required
- 🔲 Add metadata when editing transit lines for real-world detail
- 🔲 Interface remains performant even for large datasets

### Epic: Backend Processing & Simulation
- 🔲 Simulations complete in under 15 minutes
- 🔲 Results presented as a clear table for easy interpretation
- 🔲 Mode-choice model applied automatically for modal split impacts

### Epic: User Management & Access
- ✅ Each city has its own workspace for data isolation
- ✅ Secure logins for authorized users only
- ✅ Support up to 20 users per city for team collaboration

### Epic: Business Value & Positioning
- 🔲 Run independent simulations without waiting
- 🔲 Run and compare multiple project simulations quickly
- 🔲 Differentiate from competitors with speed and usability

---

## 🚀 Development Phases

### ✅ Phase 0: Foundation (COMPLETED)
**Timeline:** Weeks 0-1

#### Completed Tasks
- [x] React + TypeScript + Vite setup
- [x] Blue and white color theme implementation
- [x] API integration layer (Axios + interceptors)
- [x] Authentication system (JWT-based)
- [x] Login page with validation
- [x] Role-based dashboard (ADMIN, PLANNER, VIEWER)
- [x] Protected routes with access control
- [x] Zustand state management setup
- [x] Project documentation

**Deliverables:**
- ✅ Running frontend at http://localhost:5173/
- ✅ Login flow integrated with backend
- ✅ Role-specific dashboard views
- ✅ Test credentials documented

---

### 🔄 Phase 1: MVP - Core Viewing & Simulation (Current)
**Timeline:** Weeks 2-5
**Goal:** Enable basic network viewing and simulation management

#### Task 1.1: GeoJSON Network Viewer 🎯 HIGH PRIORITY
**User Story:** View baseline GeoJSON biking and transit networks

**Frontend Tasks:**
- [ ] Install map library (Mapbox GL JS or React-Leaflet)
  ```bash
  npm install react-leaflet leaflet
  npm install -D @types/leaflet
  ```
- [ ] Create `src/pages/Networks/NetworksPage.tsx`
- [ ] Create `src/components/Map/NetworkMap.tsx`
- [ ] Create `src/components/Networks/NetworkList.tsx`
- [ ] Implement network layer toggle (biking/transit)
- [ ] Add color-coding (blue for transit, green for biking)
- [ ] Display network metadata panel
- [ ] Add zoom/pan/reset controls
- [ ] Show network statistics (total routes, distance)

**API Endpoints:**
```typescript
GET /api/v1/geojson?cityId={cityId}
GET /api/v1/geojson/{id}
```

**Components Structure:**
```
src/pages/Networks/
├── NetworksPage.tsx        # Main page container
├── NetworksPage.css
└── components/
    ├── NetworkMap.tsx      # Leaflet/Mapbox map
    ├── NetworkList.tsx     # Sidebar list of networks
    ├── NetworkCard.tsx     # Individual network card
    ├── NetworkStats.tsx    # Statistics panel
    └── LayerControls.tsx   # Show/hide layers
```

**Acceptance Criteria:**
- [ ] Users can view all networks for their city
- [ ] Networks are color-coded by type
- [ ] Baseline networks are clearly marked
- [ ] Map is performant with multiple networks
- [ ] Users can toggle layers on/off
- [ ] Network metadata is displayed in sidebar

---

#### Task 1.2: Network Service Layer
**Technical Infrastructure**

**Tasks:**
- [ ] Create `src/services/networks.service.ts`
  ```typescript
  export const networksService = {
    getAllNetworks(cityId: string): Promise<GeoJsonNetwork[]>
    getNetworkById(id: string): Promise<GeoJsonNetwork>
    createNetwork(data: CreateNetworkDto): Promise<GeoJsonNetwork>
    updateNetwork(id: string, data: UpdateNetworkDto): Promise<GeoJsonNetwork>
    deleteNetwork(id: string): Promise<void>
  }
  ```
- [ ] Create React Query hooks
  ```typescript
  useNetworks(cityId: string)
  useNetwork(id: string)
  useCreateNetwork()
  useUpdateNetwork()
  useDeleteNetwork()
  ```
- [ ] Add optimistic updates for mutations
- [ ] Implement error handling and retry logic

**Files to Create:**
```
src/services/networks.service.ts
src/hooks/useNetworks.ts
```

---

#### Task 2.1: Simulation Creation Interface 🎯 HIGH PRIORITY
**User Story:** Create and submit simulations quickly

**Frontend Tasks:**
- [ ] Create `src/pages/Simulations/CreateSimulation.tsx`
- [ ] Build multi-step wizard component
  - Step 1: Select baseline network (dropdown)
  - Step 2: Select proposed network (dropdown)
  - Step 3: Simulation parameters (form)
  - Step 4: Review and submit
- [ ] Add network comparison preview (side-by-side)
- [ ] Implement form validation
- [ ] Show estimated runtime
- [ ] Add simulation name and description fields
- [ ] Display success/error messages
- [ ] Redirect to simulation status page on success

**Components Structure:**
```
src/pages/Simulations/
├── CreateSimulation.tsx
├── CreateSimulation.css
└── components/
    ├── SimulationWizard.tsx      # Multi-step form
    ├── NetworkSelector.tsx        # Baseline/proposed selector
    ├── SimulationForm.tsx         # Parameters form
    ├── NetworkComparison.tsx      # Side-by-side view
    └── ReviewStep.tsx             # Final review
```

**API Endpoint:**
```typescript
POST /api/v1/simulations
{
  name: string
  description?: string
  baselineNetworkId: string
  proposedNetworkId: string
  cityId: string
  metadata?: object
}
```

**Acceptance Criteria:**
- [ ] PLANNER and ADMIN can create simulations
- [ ] VIEWER cannot access this page
- [ ] Form validates all required fields
- [ ] Networks are compared before submission
- [ ] Success message shows simulation ID
- [ ] User is redirected to simulation status page

---

#### Task 2.2: Simulation Status Monitoring 🎯 HIGH PRIORITY
**User Story:** Track simulation progress in real-time

**Frontend Tasks:**
- [ ] Create `src/pages/Simulations/SimulationsPage.tsx`
- [ ] Create `src/components/Simulations/SimulationCard.tsx`
- [ ] Implement status badges (PENDING, RUNNING, COMPLETED, FAILED)
- [ ] Add polling for status updates (every 5 seconds for RUNNING)
- [ ] Show progress indicator
- [ ] Display estimated time remaining
- [ ] Add filters (by status, date)
- [ ] Implement search by simulation name
- [ ] Add "View Results" button for COMPLETED simulations
- [ ] Add "Cancel" button for RUNNING simulations

**Components Structure:**
```
src/pages/Simulations/
├── SimulationsPage.tsx
├── SimulationsPage.css
└── components/
    ├── SimulationCard.tsx        # Individual simulation
    ├── SimulationFilters.tsx     # Status/date filters
    ├── SimulationStatus.tsx      # Status badge component
    └── ProgressIndicator.tsx     # Progress bar
```

**API Endpoints:**
```typescript
GET /api/v1/simulations?cityId={cityId}
GET /api/v1/simulations/{id}
PATCH /api/v1/simulations/{id} (for cancellation)
```

**Polling Strategy:**
```typescript
useQuery(['simulation', id], fetchSimulation, {
  refetchInterval: (data) =>
    data?.status === 'RUNNING' ? 5000 : false,
  staleTime: 5000
})
```

**Acceptance Criteria:**
- [ ] Users see all simulations for their city
- [ ] Status updates automatically for running simulations
- [ ] Progress is visually indicated
- [ ] Users can filter and search simulations
- [ ] Completed simulations link to results

---

#### Task 2.3: Results Visualization 🎯 HIGH PRIORITY
**User Story:** Results presented as clear tables and visualizations

**Frontend Tasks:**
- [ ] Create `src/pages/Results/ResultsPage.tsx`
- [ ] Create sortable results table component
- [ ] Display key metrics:
  - Modal split (% bike, % transit, % car)
  - Travel time changes (before/after)
  - Distance metrics
  - Cost-benefit analysis
- [ ] Add before/after comparison charts
- [ ] Implement export to CSV functionality
- [ ] Add export to PDF functionality
- [ ] Create summary statistics panel
- [ ] Show map overlay of results (optional)

**Install Chart Library:**
```bash
npm install recharts
npm install -D @types/recharts
```

**Components Structure:**
```
src/pages/Results/
├── ResultsPage.tsx
├── ResultsPage.css
└── components/
    ├── ResultsTable.tsx          # Sortable table
    ├── MetricsPanel.tsx          # Key metrics display
    ├── ComparisonChart.tsx       # Before/after charts
    ├── ModalSplitChart.tsx       # Pie/donut chart
    ├── ExportButton.tsx          # CSV/PDF export
    └── SummaryStats.tsx          # Summary panel
```

**API Endpoints:**
```typescript
GET /api/v1/reports?simulationId={id}
GET /api/v1/reports/{id}
```

**Acceptance Criteria:**
- [ ] All users can view results for completed simulations
- [ ] Tables are sortable by all columns
- [ ] Charts clearly show before/after comparison
- [ ] Export to CSV downloads properly formatted file
- [ ] Summary statistics are accurate
- [ ] Page is responsive on different screen sizes

---

#### Task 5.1: API Service Layer (Simulations & Reports)
**Technical Infrastructure**

**Tasks:**
- [ ] Create `src/services/simulations.service.ts`
- [ ] Create `src/services/reports.service.ts`
- [ ] Create React Query hooks for simulations
- [ ] Create React Query hooks for reports
- [ ] Implement polling mechanism
- [ ] Add error handling

**Files to Create:**
```
src/services/simulations.service.ts
src/services/reports.service.ts
src/hooks/useSimulations.ts
src/hooks/useReports.ts
```

---

### Phase 1 Deliverables
- [ ] Users can view GeoJSON networks on a map
- [ ] Users can create simulations
- [ ] Users can monitor simulation progress
- [ ] Users can view and export results
- [ ] Complete API integration for networks, simulations, reports

---

### 🎨 Phase 2: Network Editing & Advanced Features
**Timeline:** Weeks 6-9
**Goal:** Enable network editing and advanced simulation features

#### Task 1.3: GeoJSON Network Editor
**User Story:** Edit baseline GeoJSON networks to test new projects

**Frontend Tasks:**
- [ ] Install drawing library
  ```bash
  npm install @mapbox/mapbox-gl-draw
  # or
  npm install react-leaflet-draw
  ```
- [ ] Create `src/pages/Networks/NetworkEditor.tsx`
- [ ] Implement drawing tools:
  - Draw polyline (for routes)
  - Edit vertices
  - Delete features
  - Move features
- [ ] Add properties editor panel
- [ ] Implement GeoJSON validation
- [ ] Add save/discard changes
- [ ] Show real-time preview

**Components Structure:**
```
src/pages/Networks/
├── NetworkEditor.tsx
├── NetworkEditor.css
└── components/
    ├── DrawingTools.tsx          # Drawing toolbar
    ├── PropertiesPanel.tsx       # Edit feature properties
    ├── VertexEditor.tsx          # Edit vertices
    └── ValidationPanel.tsx       # GeoJSON validation
```

**Acceptance Criteria:**
- [ ] PLANNER and ADMIN can edit networks
- [ ] VIEWER cannot access editor
- [ ] GeoJSON is validated before saving
- [ ] Changes are saved to backend
- [ ] User can discard unsaved changes

---

#### Task 1.4: Undo/Redo Functionality
**User Story:** Undo and redo edits quickly

**Frontend Tasks:**
- [ ] Implement history stack in Zustand store
- [ ] Create `useHistory` hook
- [ ] Add undo button (Ctrl+Z)
- [ ] Add redo button (Ctrl+Y)
- [ ] Show history panel with action list
- [ ] Limit history to 50 actions
- [ ] Clear history on save

**State Management:**
```typescript
interface HistoryState {
  past: GeoJSON[]
  present: GeoJSON
  future: GeoJSON[]
  undo: () => void
  redo: () => void
  addToHistory: (state: GeoJSON) => void
}
```

---

#### Task 1.5: Transit Line Metadata Editor
**User Story:** Add metadata to transit lines for simulation detail

**Frontend Tasks:**
- [ ] Create `src/components/Metadata/MetadataForm.tsx`
- [ ] Add metadata fields:
  - Line name/number
  - Service frequency (headway)
  - Operating hours
  - Speed/travel time
  - Capacity
  - Cost/fare
- [ ] Implement form validation
- [ ] Add batch edit for multiple features
- [ ] Create metadata templates

**Metadata Fields:**
```typescript
interface TransitMetadata {
  lineName: string
  lineNumber?: string
  frequency: number        // minutes (headway)
  startTime: string       // HH:MM
  endTime: string         // HH:MM
  speed: number           // km/h
  capacity: number        // passengers
  fare?: number           // cost
  type: 'bus' | 'tram' | 'metro' | 'rail'
}
```

---

#### Task 2.4: Multi-Simulation Comparison
**User Story:** Compare multiple simulations to prioritize projects

**Frontend Tasks:**
- [ ] Create `src/pages/Simulations/ComparisonPage.tsx`
- [ ] Allow selecting 2-4 simulations
- [ ] Display side-by-side metrics
- [ ] Add comparison charts
- [ ] Implement ranking system
- [ ] Add export comparison report
- [ ] Allow adding notes/annotations

**Components Structure:**
```
src/pages/Simulations/
├── ComparisonPage.tsx
└── components/
    ├── SimulationSelector.tsx    # Select sims to compare
    ├── ComparisonTable.tsx       # Side-by-side metrics
    ├── ComparisonCharts.tsx      # Visual comparison
    └── RankingPanel.tsx          # Ranking/scoring
```

---

#### Task 3.1: City Workspace Selector
**User Story:** Each city has its own workspace for data isolation

**Frontend Tasks:**
- [ ] Create `src/components/Layout/CitySelector.tsx`
- [ ] Add city dropdown in header
- [ ] Store selected city in state
- [ ] Fetch data for selected city
- [ ] Add city metadata display
- [ ] Implement city search
- [ ] Save default city preference

**State Management:**
```typescript
interface CityState {
  selectedCity: City | null
  availableCities: City[]
  setSelectedCity: (city: City) => void
  fetchCitiesForUser: () => void
}
```

---

#### Task 3.2: User Management Interface (ADMIN)
**User Story:** Support up to 20 users per city

**Frontend Tasks:**
- [ ] Create `src/pages/Admin/UsersPage.tsx` (ADMIN only)
- [ ] Display users table
- [ ] Add create user form
- [ ] Implement edit user modal
- [ ] Add delete/deactivate user
- [ ] Show user count per city (warn at 18/20)
- [ ] Add role assignment
- [ ] Implement user search

**Components Structure:**
```
src/pages/Admin/
├── UsersPage.tsx
└── components/
    ├── UsersTable.tsx
    ├── CreateUserModal.tsx
    ├── EditUserModal.tsx
    ├── RoleSelector.tsx
    └── UserCountBadge.tsx
```

**API Integration:**
```typescript
GET /api/v1/users?cityId={cityId}
POST /api/v1/users
PATCH /api/v1/users/{id}
DELETE /api/v1/users/{id}
```

---

### Phase 2 Deliverables
- [ ] Network editing with draw tools
- [ ] Undo/redo functionality
- [ ] Transit metadata editor
- [ ] Multi-simulation comparison
- [ ] City workspace selector
- [ ] User management interface (ADMIN)

---

### 🎯 Phase 3: UX Excellence & Performance
**Timeline:** Weeks 10-12
**Goal:** Polish UX and optimize performance

#### Task 1.6: Performance Optimization
**User Story:** Interface remains performant with large datasets

**Frontend Tasks:**
- [ ] Implement map clustering for many features
- [ ] Add virtual scrolling for long lists
- [ ] Use React.memo for expensive components
- [ ] Implement progressive loading
- [ ] Add debouncing for inputs
- [ ] Optimize map rendering (WebGL)
- [ ] Add data pagination
- [ ] Implement lazy loading for images
- [ ] Monitor performance metrics (Core Web Vitals)

**Performance Targets:**
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.0s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

---

#### Task 1.7: Intuitive Interface & Onboarding
**User Story:** Minimal training required

**Frontend Tasks:**
- [ ] Create onboarding tutorial component
- [ ] Add tooltips to all UI elements
- [ ] Design consistent icon set
- [ ] Create keyboard shortcuts guide
- [ ] Add contextual help buttons
- [ ] Build quick-start guide
- [ ] Implement responsive layouts
- [ ] Add loading states
- [ ] Create error boundaries

**Libraries to Install:**
```bash
npm install react-joyride      # Interactive tours
npm install react-tooltip      # Tooltips
```

---

#### Task 4.1: Performance Analytics Dashboard
**User Story:** Show time and cost savings

**Frontend Tasks:**
- [ ] Create `src/pages/Analytics/AnalyticsPage.tsx`
- [ ] Display metrics:
  - Average simulation runtime
  - Time saved vs traditional methods
  - Cost savings estimate
  - Number of simulations run
  - Most active users
  - Most simulated areas
- [ ] Add date range selector
- [ ] Create visualization charts

---

#### Task 4.2: Project Portfolio Management
**User Story:** Organize and manage multiple projects

**Frontend Tasks:**
- [ ] Create `src/pages/Projects/ProjectsPage.tsx`
- [ ] Allow grouping simulations into projects
- [ ] Add project creation wizard
- [ ] Implement project-level comparison
- [ ] Add project status tracking
- [ ] Create project export/sharing

**Project Structure:**
```typescript
interface Project {
  id: string
  name: string
  description: string
  cityId: string
  simulations: Simulation[]
  status: 'active' | 'archived' | 'completed'
  createdBy: string
  createdAt: Date
}
```

---

### Phase 3 Deliverables
- [ ] Optimized performance for large datasets
- [ ] Onboarding and help system
- [ ] Performance analytics dashboard
- [ ] Project portfolio management
- [ ] Polished, production-ready UI

---

### 🧪 Phase 4: Testing & Quality Assurance
**Timeline:** Weeks 13-14
**Goal:** Comprehensive testing and bug fixes

#### Task 5.2: Testing Infrastructure

**Install Testing Libraries:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D @vitest/ui
npm install -D playwright
```

**Testing Tasks:**
- [ ] Set up Vitest configuration
- [ ] Write unit tests for components
- [ ] Write integration tests for user flows
- [ ] Add E2E tests with Playwright:
  - Login flow
  - Network viewing
  - Simulation creation
  - Results viewing
- [ ] Implement visual regression testing
- [ ] Add accessibility testing (axe-core)
- [ ] Test role-based access control
- [ ] Test responsive layouts

**Test Coverage Targets:**
- Unit tests: > 80%
- Integration tests: Critical user flows
- E2E tests: Happy paths + error scenarios
- Accessibility: WCAG 2.1 AA compliance

---

### Phase 4 Deliverables
- [ ] Comprehensive test suite
- [ ] E2E tests for all critical flows
- [ ] Accessibility audit passed
- [ ] Bug fixes and optimizations
- [ ] Performance benchmarks met

---

## 🎨 Design System

### Color Palette (Blue & White Theme)
```css
Primary Blue:
  --color-primary-50: #E3F2FD
  --color-primary-500: #2196F3
  --color-primary-600: #1E88E5
  --color-primary-700: #1976D2

Neutral:
  --color-white: #FFFFFF
  --color-neutral-50: #FAFAFA
  --color-neutral-900: #212121
```

### Component Library
- Buttons: Primary, Secondary, Outline
- Forms: Input, Select, Checkbox, Radio
- Cards: Default, Elevated
- Tables: Sortable, Filterable
- Modals: Small, Medium, Large
- Toasts: Success, Error, Warning, Info

---

## 📦 Technology Stack

### Core
- React 18
- TypeScript 5
- Vite 7
- React Router DOM 6

### State Management
- Zustand (auth, global state)
- React Query (server state)

### UI & Styling
- CSS Variables (theming)
- CSS Modules / Plain CSS

### Maps & Visualization
- React-Leaflet or Mapbox GL JS
- Recharts (charts and graphs)

### Data Fetching
- Axios (HTTP client)
- React Query (caching, polling)

### Forms
- React Hook Form
- Zod (validation)

### Testing
- Vitest (unit tests)
- React Testing Library
- Playwright (E2E)

---

## 📊 Success Metrics

### Performance
- [ ] Simulation creation < 2 seconds
- [ ] Network map loads < 3 seconds
- [ ] Results page loads < 2 seconds
- [ ] App bundle size < 500KB (gzipped)

### User Experience
- [ ] Time to create simulation < 2 minutes
- [ ] Users can complete tasks without help docs
- [ ] > 90% success rate for first-time users
- [ ] Zero critical accessibility issues

### Business
- [ ] Support 20 users per city
- [ ] Handle 100+ simulations per city
- [ ] Display networks with 1000+ features
- [ ] 99% uptime

---

## 🚧 Current Status

### ✅ Completed (Phase 0)
- React frontend setup
- Blue/white theme
- Authentication & login
- Role-based dashboard
- Protected routes
- API integration layer

### 🔄 In Progress (Phase 1)
- None yet - Ready to start!

### 📋 Next Steps
1. **Task 1.1**: GeoJSON Network Viewer (Week 2)
2. **Task 2.1**: Simulation Creation Interface (Week 3)
3. **Task 2.2**: Simulation Status Monitoring (Week 3)
4. **Task 2.3**: Results Visualization (Week 4)

---

## 📞 Support

For questions or issues:
- Technical Lead: [Add contact]
- Documentation: `/frontend/README.md`
- Backend API: `http://localhost:3009/docs`

---

**Last Updated:** November 8, 2025
**Version:** 1.0
**Status:** Phase 0 Complete, Phase 1 Ready to Start
