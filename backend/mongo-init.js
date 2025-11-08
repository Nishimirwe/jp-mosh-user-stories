// MongoDB initialization script
// This creates the database and a user with read/write access

db = db.getSiblingDB('mosh_db');

// Create collections with validation
db.createCollection('cities', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'slug'],
      properties: {
        name: { bsonType: 'string' },
        slug: { bsonType: 'string' },
        active: { bsonType: 'bool' },
      },
    },
  },
});

db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'passwordHash'],
      properties: {
        email: { bsonType: 'string' },
        passwordHash: { bsonType: 'string' },
        roles: { bsonType: 'array' },
      },
    },
  },
});

// Create indexes
db.cities.createIndex({ slug: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

print('MongoDB initialized successfully for MOSH backend');
