export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/mosh_db?authSource=admin',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  storage: {
    endpoint: process.env.STORAGE_ENDPOINT || 'localhost',
    port: parseInt(process.env.STORAGE_PORT || '9000', 10),
    accessKey: process.env.STORAGE_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.STORAGE_SECRET_KEY || 'minioadmin123',
    bucket: process.env.STORAGE_BUCKET || 'mosh-geojson',
  },

  simulation: {
    maxRuntimeMs: parseInt(process.env.MAX_SIMULATION_RUNTIME_MS || '900000', 10),
    workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY || '4', 10),
    raptorServiceUrl: process.env.RAPTOR_SERVICE_URL || 'http://localhost:8000',
  },

  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  limits: {
    maxUsersPerCity: parseInt(process.env.MAX_USERS_PER_CITY || '20', 10),
  },
});
