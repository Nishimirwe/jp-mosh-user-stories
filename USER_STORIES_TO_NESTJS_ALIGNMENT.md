# MOSH User Stories → NestJS Implementation Alignment

## Overview

This document maps the user stories from the MOSH Website requirements to the existing NestJS + MongoDB design, identifies gaps, and provides recommendations.

---

## ✅ Well-Covered Areas

### 1. **Multi-tenancy & Workspace Management**

**User Stories:**
- ✅ "As an admin, I want each city to have its own workspace"
- ✅ "As an admin, I want to support up to 20 users per city"

**NestJS Implementation:**
- `cities` module handles workspace creation
- `City` schema provides data isolation
- User schema links users to cities via `city: City` reference
- Multi-tenant architecture is built into the design

**Status:** ✅ **Fully covered**

---

### 2. **Authentication & Security**

**User Stories:**
- ✅ "As a city planner, I want secure logins"
- ✅ "As an admin, I want to support up to 20 users per city"

**NestJS Implementation:**
- `auth` module with JWT + Passport
- Role-based access (admin, planner, viewer)
- User schema with roles array

**Status:** ✅ **Fully covered**

**Recommendation:** Add user limit enforcement (20 users per city) in the `users` module

---

### 3. **GeoJSON Management**

**User Stories:**
- ✅ "As a city planner, I want to view baseline GeoJSON networks"
- ✅ "As a city planner, I want to edit baseline GeoJSON networks"
- ✅ "As a system, I want to validate GeoJSON edits"

**NestJS Implementation:**
- `geojson` module with upload, validate, store endpoints
- GeoJSON metadata schema with MongoDB 2dsphere indexing
- Validation service using `geojsonhint`
- Support for both biking and transit networks

**Status:** ✅ **Fully covered**

---

### 4. **Simulation Engine Integration**

**User Stories:**
- ✅ "As a backend engineer, I want to ingest edited GeoJSON data"
- ✅ "As a user, I want simulations to complete in under 15 minutes"
- ✅ "As a system, I want to parallelize simulations"

**NestJS Implementation:**
- `simulation` module with job submission and status tracking
- `SimulationJob` schema with status tracking
- BullMQ + Redis for queue management
- Python RAPTOR microservice integration
- Worker pattern for parallel processing

**Status:** ✅ **Well covered**

**Recommendation:** Add explicit 15-minute timeout enforcement in worker

---

### 5. **Results & Reporting**

**User Stories:**
- ✅ "As a user, I want results presented as a clear table"
- ✅ "As a planner, I want to run and compare multiple simulations"

**NestJS Implementation:**
- `reports` module for tabular outputs
- CSV/Excel export capabilities
- Comparison API endpoint: `POST /cities/:cityId/simulations/compare`

**Status:** ✅ **Fully covered**

---

## ⚠️ Areas Needing Enhancement

### 6. **Undo/Redo for Edits**

**User Stories:**
- ⚠️ "As a city planner, I want to undo and redo edits quickly"

**Current NestJS Implementation:**
- GeoJSON versioning mentioned but not detailed
- No explicit undo/redo mechanism

**Gap:** Undo/redo functionality not implemented

**Recommendation:**
```typescript
// Add to GeoJsonFile schema
@Schema({ timestamps: true })
export class GeoJsonFile extends Document {
  // ... existing fields ...
  @Prop({ type: [Object] }) versionHistory: any[];  // Array of previous versions
  @Prop() currentVersionIndex: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GeoJsonFile' })
  parentVersionId?: string;  // Link to parent version
}
```

**Action Items:**
- Implement version history tracking
- Add endpoints: `POST /cities/:cityId/geojson/:id/undo` and `POST /cities/:cityId/geojson/:id/redo`
- Store diffs instead of full copies to save space
- Limit version history (e.g., last 50 changes)

---

### 7. **Mode-Choice Model**

**User Stories:**
- ⚠️ "As a planner, I want the mode-choice model applied automatically"

**Current NestJS Implementation:**
- Mentioned as RAPTOR responsibility
- Not explicitly defined in schema or API

**Gap:** Mode-choice model integration unclear

**Recommendation:**
```typescript
// Add to SimulationJob schema
@Schema({ timestamps: true })
export class SimulationJob extends Document {
  // ... existing fields ...
  @Prop({ type: Object }) modeChoiceResults?: {
    transitShare: number;
    bikingShare: number;
    drivingShare: number;
    walkingShare: number;
  };
  @Prop({ type: Object }) modeChoiceParams?: {
    algorithm: string;  // e.g., "logit"
    calibrationData: any;
  };
}
```

**Action Items:**
- Define mode-choice model parameters in simulation request
- Ensure RAPTOR microservice includes mode-choice calculation
- Store modal split results separately in `SimulationJob`
- Add endpoint: `GET /cities/:cityId/simulations/:simId/modal-split`

---

### 8. **Metadata for Transit Lines**

**User Stories:**
- ⚠️ "As a user, I want to add metadata when editing transit lines"

**Current NestJS Implementation:**
- Generic `metadata: any` field in GeoJsonFile schema
- No structured transit metadata schema

**Gap:** Transit-specific metadata structure not defined

**Recommendation:**
```typescript
// Define structured transit metadata interface
interface TransitMetadata {
  schedules?: {
    routeId: string;
    trips: Array<{
      tripId: string;
      stopTimes: Array<{ stopId: string; arrivalTime: string; departureTime: string }>;
    }>;
  }[];
  frequencies?: {
    routeId: string;
    headwaySecs: number;  // Time between vehicles
    startTime: string;
    endTime: string;
  }[];
  capacities?: {
    routeId: string;
    seatedCapacity: number;
    standingCapacity: number;
  }[];
}

// Update GeoJsonFile schema
@Schema({ timestamps: true })
export class GeoJsonFile extends Document {
  // ... existing fields ...
  @Prop({ type: Object }) transitMetadata?: TransitMetadata;
  @Prop({ type: Object }) bikingMetadata?: any;
}
```

**Action Items:**
- Create DTOs for transit metadata validation
- Add endpoints for metadata-only updates
- Validate metadata structure in validation service
- Document metadata schema in Swagger/OpenAPI

---

### 9. **Performance Monitoring**

**User Stories:**
- ⚠️ "As a planner, I want simulation runtime to remain consistent"
- ⚠️ "As a planner, I want the interface to remain performant even for large datasets"

**Current NestJS Implementation:**
- Basic simulation job tracking
- No explicit performance metrics

**Gap:** No performance monitoring/metrics collection

**Recommendation:**
```typescript
// Add to SimulationJob schema
@Schema({ timestamps: true })
export class SimulationJob extends Document {
  // ... existing fields ...
  @Prop() runtimeMs: number;  // Actual runtime in milliseconds
  @Prop() datasetSize?: {
    numStops: number;
    numRoutes: number;
    numFeatures: number;
  };
  @Prop() performanceMetrics?: {
    validationTimeMs: number;
    raptorTimeMs: number;
    aggregationTimeMs: number;
  };
}
```

**Action Items:**
- Add performance tracking middleware
- Log simulation runtime metrics
- Add alerting for simulations exceeding 15 minutes
- Create performance dashboard endpoint: `GET /cities/:cityId/performance/metrics`
- Monitor MongoDB query performance with profiling

---

### 10. **Subdomain Support**

**User Stories:**
- ✅ "As an admin, I want each city to have its subdomain"

**Current NestJS Implementation:**
- City schema has `slug` field
- No subdomain routing implementation

**Gap:** Subdomain-based routing not implemented

**Recommendation:**

**Option A: Subdomain Routing (Preferred for Production)**
```typescript
// In main.ts or app.module.ts
import { Request } from 'express';

// Middleware to extract tenant from subdomain
export function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const host = req.hostname;
  const subdomain = host.split('.')[0];

  if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
    req['tenantSlug'] = subdomain;
  }

  next();
}

// Guard to enforce tenant isolation
@Injectable()
export class TenantGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantSlug = request.tenantSlug;
    const user = request.user;

    // Verify user belongs to this tenant
    const city = await this.cityService.findBySlug(tenantSlug);
    return user.city.toString() === city._id.toString();
  }
}
```

**Option B: Path-based Multi-tenancy (Easier for Development)**
```
/api/v1/cities/:cityId/...  (current approach - keep this)
```

**Action Items:**
- Implement subdomain middleware for production
- Add subdomain configuration to City schema
- Update Nginx/load balancer config for wildcard subdomains
- Support both subdomain and path-based routing

---

### 11. **Real-time Updates**

**User Stories:**
- ⚠️ "As a user, I want simulation progress updates in real-time"

**Current NestJS Implementation:**
- Polling-based status checks: `GET /cities/:cityId/simulations/:simId`
- No WebSocket/SSE implementation mentioned

**Gap:** Real-time updates not implemented

**Recommendation:**

```typescript
// Install: npm install @nestjs/websockets @nestjs/platform-socket.io

// Create WebSocket gateway
@WebSocketGateway({ cors: true })
export class SimulationGateway {
  @WebSocketServer() server: Server;

  emitProgress(simulationId: string, progress: number, status: string) {
    this.server.to(`simulation-${simulationId}`).emit('progress', {
      simulationId,
      progress,
      status,
      timestamp: new Date()
    });
  }

  @SubscribeMessage('subscribe-simulation')
  handleSubscribe(@MessageBody() simulationId: string, @ConnectedSocket() client: Socket) {
    client.join(`simulation-${simulationId}`);
  }
}

// In simulation worker
async processSimulation(job: Job) {
  const { simulationId } = job.data;

  // Update progress at various stages
  await this.simulationGateway.emitProgress(simulationId, 10, 'validating');
  // ... validation ...

  await this.simulationGateway.emitProgress(simulationId, 50, 'running-raptor');
  // ... RAPTOR execution ...

  await this.simulationGateway.emitProgress(simulationId, 90, 'aggregating');
  // ... aggregation ...

  await this.simulationGateway.emitProgress(simulationId, 100, 'completed');
}
```

**Action Items:**
- Add `@nestjs/websockets` and `@nestjs/platform-socket.io`
- Create `SimulationGateway` for WebSocket connections
- Update worker to emit progress events
- Document WebSocket API for frontend integration

---

## 📊 Additional Schema Enhancements

### Audit Logging

**User Story:** Implied security requirement

**Recommendation:**
```typescript
@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' }) city: City;
  @Prop() action: string;  // e.g., "CREATE_SIMULATION", "EDIT_GEOJSON"
  @Prop({ type: Object }) metadata: any;
  @Prop() ipAddress?: string;
  @Prop() userAgent?: string;
}
```

**Action Items:**
- Create audit logging middleware
- Log all critical operations (simulation runs, data edits, user actions)
- Add endpoint: `GET /cities/:cityId/audit-logs`

---

## 🔄 Updated API Endpoints

Based on gaps identified, here are **additional endpoints** to add:

```typescript
// GeoJSON Versioning
GET    /api/v1/cities/:cityId/geojson/:id/versions
POST   /api/v1/cities/:cityId/geojson/:id/undo
POST   /api/v1/cities/:cityId/geojson/:id/redo
GET    /api/v1/cities/:cityId/geojson/:id/diff/:versionId

// Transit Metadata
PUT    /api/v1/cities/:cityId/geojson/:id/metadata/transit
GET    /api/v1/cities/:cityId/geojson/:id/metadata/transit

// Simulation Progress (WebSocket alternative)
GET    /api/v1/cities/:cityId/simulations/:simId/progress (SSE endpoint)

// Mode Choice Results
GET    /api/v1/cities/:cityId/simulations/:simId/modal-split

// Performance Metrics
GET    /api/v1/cities/:cityId/performance/metrics
GET    /api/v1/cities/:cityId/performance/simulations

// Audit Logs
GET    /api/v1/cities/:cityId/audit-logs
```

---

## 📋 Updated Action Plan

### Phase 1 — Core API & Auth (3-7 days) ✅
- [x] Implement auth module (JWT + Passport)
- [x] Implement city module
- [x] Add role-based guards
- [x] Create seed admin user
- [ ] **NEW:** Add user limit enforcement (20 per city)
- [ ] **NEW:** Implement audit logging middleware

### Phase 2 — GeoJSON ingestion & validation (4-7 days) ✅➕
- [x] Implement geojson module
- [x] Store GeoJSON in MongoDB + S3/MinIO
- [x] Add validation logic
- [ ] **NEW:** Add structured transit metadata schema
- [ ] **NEW:** Implement version history tracking
- [ ] **NEW:** Add undo/redo endpoints
- [ ] **NEW:** Create metadata-specific endpoints

### Phase 3 — Simulation job plumbing (4-10 days) ✅➕
- [x] Add simulation module and job schema
- [x] Integrate BullMQ + Redis
- [x] Store simulation results
- [ ] **NEW:** Add mode-choice results to schema
- [ ] **NEW:** Implement WebSocket gateway for real-time updates
- [ ] **NEW:** Add 15-minute timeout enforcement
- [ ] **NEW:** Add performance metrics tracking

### Phase 4 — RAPTOR engine integration (5-14 days) ⚠️
- [x] Containerize Python RAPTOR microservice
- [x] Define JSON input/output schema
- [x] Integrate with worker
- [ ] **NEW:** Ensure mode-choice model is included in RAPTOR output
- [ ] **NEW:** Add performance profiling to RAPTOR service
- [ ] **NEW:** Implement result caching for repeated simulations

### Phase 5 — Results, comparison & UI contracts (3-7 days) ✅
- [x] Implement results endpoints
- [x] CSV export
- [x] Comparison APIs
- [ ] **NEW:** Add modal split visualization endpoint

### Phase 6 — Multi-tenancy & security (7-14 days) ✅➕
- [x] Enforce data isolation by city
- [x] Add limits and rate control
- [ ] **NEW:** Implement subdomain routing (production)
- [ ] **NEW:** Add tenant-aware middleware
- [ ] **NEW:** Implement comprehensive audit logging

### Phase 7 — Polish & docs (3-7 days) ✅➕
- [x] Add tests
- [x] CI/CD pipelines
- [x] API docs (Swagger)
- [ ] **NEW:** Document WebSocket API
- [ ] **NEW:** Document metadata schemas
- [ ] **NEW:** Add performance benchmarking tests

---

## 🎯 Priority Recommendations

### High Priority (Must Have)
1. **Undo/Redo functionality** — Critical for user experience
2. **Structured transit metadata** — Required for RAPTOR accuracy
3. **15-minute timeout enforcement** — User story requirement
4. **Mode-choice results storage** — Core feature requirement
5. **User limit enforcement** — Business requirement

### Medium Priority (Should Have)
6. **WebSocket real-time updates** — Better UX than polling
7. **Performance metrics tracking** — Needed for SLA monitoring
8. **Audit logging** — Security and compliance
9. **Version history** — Data integrity and debugging

### Low Priority (Nice to Have)
10. **Subdomain routing** — Can use path-based initially
11. **Advanced performance dashboard** — Can add later
12. **Result caching** — Optimization for later

---

## 🚀 Quick Start Checklist

### Immediate Actions
- [ ] Review this alignment document with your team
- [ ] Decide on priorities from recommendations above
- [ ] Update MongoDB schemas with suggested enhancements
- [ ] Add new endpoints to API design
- [ ] Update Swagger/OpenAPI documentation

### Week 1 Additions
- [ ] Implement version history for GeoJSON edits
- [ ] Create structured transit metadata DTOs
- [ ] Add user limit validation (20 per city)
- [ ] Implement basic audit logging

### Week 2-3 Additions
- [ ] Add WebSocket gateway for real-time updates
- [ ] Implement undo/redo endpoints
- [ ] Add performance metrics tracking
- [ ] Update RAPTOR integration to include mode-choice

### Week 4+ Enhancements
- [ ] Implement subdomain routing
- [ ] Add comprehensive performance dashboard
- [ ] Optimize with result caching
- [ ] Complete all testing and documentation

---

## 📚 Technology Stack - Final Recommendation

Your existing NestJS + MongoDB stack is **excellent** for this project. Here's why:

✅ **Keep:**
- NestJS (great structure, TypeScript, middleware)
- MongoDB with 2dsphere indexing (perfect for GeoJSON)
- BullMQ + Redis (robust job queuing)
- Python RAPTOR microservice (specialized for transit routing)
- JWT + Passport (industry standard)

✅ **Add:**
- Socket.io for WebSockets
- Winston or Pino for structured logging
- Swagger/OpenAPI for API documentation
- Jest for testing (comes with NestJS)

✅ **Consider:**
- TimescaleDB or InfluxDB for performance metrics (if needed)
- Sentry for error tracking
- Prometheus + Grafana for monitoring

---

## 📖 Summary

Your existing NestJS design covers **~80%** of the user stories! The main enhancements needed are:

1. **Undo/Redo for edits** (version control)
2. **Structured transit metadata** (schedules, frequencies)
3. **Mode-choice model integration** (explicit in schema)
4. **Real-time progress updates** (WebSocket)
5. **Performance tracking** (metrics and monitoring)

The core architecture is solid. Focus on the high-priority recommendations above to achieve 100% coverage of user stories.

**Next Step:** Start with Phase 1 enhancements (user limits, audit logging) while your team continues core development.
