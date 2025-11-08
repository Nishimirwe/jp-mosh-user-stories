# MOSH Backend Design — NestJS + MongoDB

> **Modal Shift World (MOSH)** — Backend design document specialized for NestJS implementation using **MongoDB**. Includes architecture, API design, schema structures, action plan, and sample GeoJSON data to get started.

---

## 1. Purpose

This document translates the MOSH user stories into a concrete backend implementation plan using **NestJS** (TypeScript) and **MongoDB**. It provides an action plan, recommended project structure, example schema definitions, and *sample GeoJSON* to use for development and testing.

---

## 2. High-level responsibilities

- **Ingest & validate** GeoJSON biking & transit networks.
- **Store** GeoJSON and metadata in MongoDB (with indexing for GeoJSON queries).
- **Trigger & run** RAPTOR-based simulations (background workers).
- **Parallelize** simulation jobs & aggregate results.
- **Apply mode-choice** models automatically.
- **Secure** multi-tenant (city-based) workspaces and role-based user management.
- **Provide** result retrieval and comparison endpoints in tabular/JSON form.

---

## 3. Recommended stack (NestJS-focused)

- Backend framework: **NestJS** (TypeScript)
- ODM: **Mongoose** (official NestJS Mongoose integration)
- Database: **MongoDB** (with GeoJSON index support)
- Storage: **S3 / MinIO** (GeoJSON files if large)
- Queue / Worker: **BullMQ (Redis)** or **RabbitMQ** with NestJS queues
- Simulation engine: **Python RAPTOR service** (containerized)
- Authentication: **JWT** with Passport (nestjs/passport)
- Container orchestration: **Docker + Kubernetes** (optional at start — docker-compose OK for dev)

---

## 4. Core modules (NestJS)

1. `auth` — login, JWT, roles (admin, planner, viewer)
2. `tenancy` — city workspace management (multi-tenancy)
3. `geojson` — upload, validate, store, versioning
4. `simulation` — submit job, status, results
5. `users` — user CRUD, invitations, limits (20 per city)
6. `storage` — S3/MinIO adapter
7. `workers` — queue processors to call simulation engine
8. `reports` — result formatting, CSV/Excel export

---

## 5. API surface (example endpoints)

> Base path: `/api/v1`

### Auth
- `POST /auth/login` — returns JWT
- `POST /auth/register` — admin-only create user

### Tenancy
- `POST /cities` — create a city workspace (admin)
- `GET /cities/:id` — get city metadata

### GeoJSON
- `POST /cities/:cityId/geojson` — upload GeoJSON (multipart or JSON body)
- `PUT /cities/:cityId/geojson/:id` — update/edit existing GeoJSON
- `GET /cities/:cityId/geojson/:id` — fetch GeoJSON metadata + signed URL
- `POST /cities/:cityId/geojson/:id/validate` — run server-side validation

### Simulation
- `POST /cities/:cityId/simulations` — trigger simulation (body: baselineGeojsonId, editDiffs, params)
- `GET /cities/:cityId/simulations/:simId` — get simulation status + results summary
- `GET /cities/:cityId/simulations/:simId/results` — download full results (JSON/CSV)
- `POST /cities/:cityId/simulations/compare` — compare multiple simulations

### Reports
- `GET /cities/:cityId/reports/:reportId` — tabular outputs

---

## 6. MongoDB schema definitions (Mongoose)

### City schema
```ts
@Schema()
export class City extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ unique: true }) slug: string;
  @Prop({ default: true }) active: boolean;
}
export const CitySchema = SchemaFactory.createForClass(City);
```

### User schema
```ts
@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' }) city: City;
  @Prop({ type: [String], default: ['viewer'] }) roles: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
```

### GeoJSON metadata schema
```ts
@Schema({ timestamps: true })
export class GeoJsonFile extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' }) city: City;
  @Prop() filename: string;
  @Prop() storageKey: string;
  @Prop({ enum: ['biking', 'transit'] }) type: string;
  @Prop({ type: Object }) metadata: any;
  @Prop({ type: Object }) geojson: any;
}
export const GeoJsonFileSchema = SchemaFactory.createForClass(GeoJsonFile);
GeoJsonFileSchema.index({ geojson: '2dsphere' });
```

### Simulation job schema
```ts
@Schema({ timestamps: true })
export class SimulationJob extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' }) city: City;
  @Prop({ enum: ['queued', 'running', 'failed', 'done'], default: 'queued' }) status: string;
  @Prop({ type: Object }) params: any;
  @Prop({ type: Object }) resultsSummary: any;
  @Prop() resultsStorageKey?: string;
}
export const SimulationJobSchema = SchemaFactory.createForClass(SimulationJob);
```

---

## 7. GeoJSON validation

Server-side validation responsibilities:
- Ensure valid GeoJSON top-level type (`FeatureCollection`)
- Required feature properties (e.g., `id`, `type`, `mode`, `route_id` for transit)
- Geometry validity (LineString for routes, Point for stops)
- Coordinate reference system (expect WGS84 / EPSG:4326 or reject)

Implement `geojson-validator` service in NestJS using `@types/geojson` and libraries like `geojsonhint` or custom validators.

---

## 8. Simulation worker pattern (recommended)

Architecture:
1. API receives simulation request → creates `SimulationJob` document with `status=queued`.
2. API pushes job ID to queue (BullMQ / RabbitMQ).
3. Worker picks job → fetches GeoJSON from DB or storage → prepares input for RAPTOR.
4. Worker calls RAPTOR engine (Python microservice).
5. Worker stores results in storage and updates job to `done`.
6. API lets frontend poll for job status.

---

## 9. Action Plan (detailed)

### Phase 0 — Preparation (1–3 days)
- Create repo, license, README.
- Provision local MongoDB, Redis, and MinIO with docker-compose.
- Create project skeleton with Nest CLI: `nest new mosh-backend`.

### Phase 1 — Core API & Auth (3–7 days)
- Implement `auth` module (JWT + Passport) and user schema.
- Implement `city` module.
- Add role-based guards.
- Create seed admin user.

### Phase 2 — GeoJSON ingestion & validation (4–7 days)
- Implement `geojson` module with upload and validation endpoints.
- Store GeoJSON in MongoDB (and optionally in S3/MinIO).
- Add validation logic.

### Phase 3 — Simulation job plumbing (4–10 days)
- Add `simulation` module and job schema.
- Integrate queue (BullMQ + Redis) and worker process.
- Store simulation results in storage.

### Phase 4 — RAPTOR engine integration (5–14 days)
- Containerize Python RAPTOR microservice.
- Define JSON input/output schema.
- Integrate with worker for execution.

### Phase 5 — Results, comparison & UI contracts (3–7 days)
- Implement results endpoints, CSV export, and comparison APIs.

### Phase 6 — Multi-tenancy & security (7–14 days)
- Enforce data isolation by city in MongoDB.
- Add limits, rate control, and metrics.

### Phase 7 — Polish & docs (3–7 days)
- Add tests, CI/CD pipelines.
- Finalize API docs (Swagger) and developer guides.

---

## 10. Directory structure — NestJS + MongoDB

```
mosh-backend/
├── apps/api/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── cities/
│   │   │   ├── geojson/
│   │   │   ├── simulation/
│   │   │   ├── storage/
│   │   ├── common/
│   │   ├── config/
│   └── Dockerfile
├── packages/worker/
│   ├── src/
│   └── Dockerfile
├── infra/
│   ├── docker-compose.yml
│   ├── k8s/
└── README.md
```

---

## 11. Sample GeoJSON data

### Biking network
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "id": "bike_seg_1", "name": "Main St Bike Lane", "type": "bikeway", "lane_type": "protected" },
      "geometry": { "type": "LineString", "coordinates": [[-73.9851,40.7589], [-73.9840,40.7595]] }
    }
  ]
}
```

### Transit network
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "id": "stop_1", "type": "stop", "name": "Central Station", "stop_id": "100" },
      "geometry": { "type": "Point", "coordinates": [-73.9855,40.7580] }
    }
  ]
}
```

---

## 12. Example simulation job payload
```json
{
  "cityId": "<city-id>",
  "baselineGeojsonId": "<geojson-id>",
  "params": { "startTime": "08:00", "endTime": "10:00" }
}
```

---

## 13. Security considerations

- Validate GeoJSON structure before inserting into MongoDB.
- Enforce file size and field constraints.
- Use indexed queries with `2dsphere` for efficient geospatial operations.
- Secure credentials with environment variables and JWT expiry policies.

---

## 14. Next steps

- Scaffold NestJS project with Mongoose schemas.
- Add Swagger documentation.
- Build BullMQ worker integration for RAPTOR jobs.
- Add API testing and CI/CD.

