import { Injectable, Logger } from '@nestjs/common';
import { CitiesService } from '../cities/cities.service';
import { UsersService } from '../users/users.service';
import { GeojsonService } from '../geojson/geojson.service';
import { UserRole } from '../users/schemas/user.schema';
import { NetworkType } from '../geojson/dto/create-geojson.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private citiesService: CitiesService,
    private usersService: UsersService,
    private geojsonService: GeojsonService,
  ) {}

  async seedAll(): Promise<{
    cities: number;
    users: number;
    networks: number;
    message: string;
  }> {
    this.logger.log('Starting database seeding...');

    // Step 1: Seed Cities
    const cities = await this.seedCities();
    this.logger.log(`Seeded ${cities.length} cities`);

    // Step 2: Seed Users for each city
    const users = await this.seedUsers(cities);
    this.logger.log(`Seeded ${users.length} users`);

    // Step 3: Seed GeoJSON Networks
    const networks = await this.seedNetworks(cities);
    this.logger.log(`Seeded ${networks.length} networks`);

    this.logger.log('Database seeding completed!');

    return {
      cities: cities.length,
      users: users.length,
      networks: networks.length,
      message: 'Database seeded successfully with rich test data!',
    };
  }

  private async seedCities(): Promise<any[]> {
    const citiesData = [
      {
        name: 'New York',
        slug: 'new-york',
        description: 'Transportation planning for New York metropolitan area - testing sustainable transit solutions',
        country: 'United States',
        timezone: 'America/New_York',
        active: true,
        metadata: {
          population: 8336817,
          area: 783.8,
          coordinates: { lat: 40.7128, lng: -74.0060 },
        },
      },
      {
        name: 'Paris',
        slug: 'paris',
        description: 'Modal shift initiatives for Greater Paris region - focus on cycling infrastructure',
        country: 'France',
        timezone: 'Europe/Paris',
        active: true,
        metadata: {
          population: 2165423,
          area: 105.4,
          coordinates: { lat: 48.8566, lng: 2.3522 },
        },
      },
      {
        name: 'Tokyo',
        slug: 'tokyo',
        description: 'Transit network optimization for Tokyo metropolitan area',
        country: 'Japan',
        timezone: 'Asia/Tokyo',
        active: true,
        metadata: {
          population: 13960000,
          area: 2194,
          coordinates: { lat: 35.6762, lng: 139.6503 },
        },
      },
      {
        name: 'Amsterdam',
        slug: 'amsterdam',
        description: 'Bicycle network expansion and optimization study',
        country: 'Netherlands',
        timezone: 'Europe/Amsterdam',
        active: true,
        metadata: {
          population: 872680,
          area: 219.3,
          coordinates: { lat: 52.3676, lng: 4.9041 },
        },
      },
      {
        name: 'Copenhagen',
        slug: 'copenhagen',
        description: 'Sustainable transportation planning - cycling superhighways',
        country: 'Denmark',
        timezone: 'Europe/Copenhagen',
        active: true,
        metadata: {
          population: 799033,
          area: 86.4,
          coordinates: { lat: 55.6761, lng: 12.5683 },
        },
      },
    ];

    const createdCities: any[] = [];
    for (const cityData of citiesData) {
      try {
        const city = await this.citiesService.create(cityData);
        createdCities.push(city);
      } catch (error) {
        this.logger.warn(`City ${cityData.name} may already exist, skipping...`);
      }
    }

    return createdCities;
  }

  private async seedUsers(cities: any[]): Promise<any[]> {
    const usersData = [
      // New York Users
      {
        email: 'john.admin@newyork.gov',
        password: 'password123',
        firstName: 'John',
        lastName: 'Administrator',
        cityId: cities[0]?._id?.toString(),
        roles: [UserRole.ADMIN, UserRole.PLANNER],
        metadata: {
          department: 'Department of Transportation',
          phone: '+1-212-555-0101',
          office: 'City Hall, Room 401',
        },
      },
      {
        email: 'sarah.planner@newyork.gov',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        cityId: cities[0]?._id?.toString(),
        roles: [UserRole.PLANNER],
        metadata: {
          department: 'Transit Planning',
          specialization: 'Bicycle Infrastructure',
        },
      },
      {
        email: 'mike.analyst@newyork.gov',
        password: 'password123',
        firstName: 'Michael',
        lastName: 'Chen',
        cityId: cities[0]?._id?.toString(),
        roles: [UserRole.VIEWER],
        metadata: {
          department: 'Data Analytics',
        },
      },
      // Paris Users
      {
        email: 'marie.admin@paris.fr',
        password: 'password123',
        firstName: 'Marie',
        lastName: 'Dubois',
        cityId: cities[1]?._id?.toString(),
        roles: [UserRole.ADMIN],
        metadata: {
          department: 'Direction de la Voirie et des Déplacements',
          phone: '+33-1-4276-4000',
        },
      },
      {
        email: 'pierre.planner@paris.fr',
        password: 'password123',
        firstName: 'Pierre',
        lastName: 'Martin',
        cityId: cities[1]?._id?.toString(),
        roles: [UserRole.PLANNER],
        metadata: {
          department: 'Vélo Planning',
          specialization: 'Cycling Networks',
        },
      },
      // Tokyo Users
      {
        email: 'yuki.admin@tokyo.jp',
        password: 'password123',
        firstName: 'Yuki',
        lastName: 'Tanaka',
        cityId: cities[2]?._id?.toString(),
        roles: [UserRole.ADMIN, UserRole.PLANNER],
        metadata: {
          department: 'Bureau of Urban Development',
        },
      },
      {
        email: 'hiro.planner@tokyo.jp',
        password: 'password123',
        firstName: 'Hiroshi',
        lastName: 'Yamamoto',
        cityId: cities[2]?._id?.toString(),
        roles: [UserRole.PLANNER],
        metadata: {
          department: 'Rail Transit Planning',
        },
      },
      // Amsterdam Users
      {
        email: 'anna.admin@amsterdam.nl',
        password: 'password123',
        firstName: 'Anna',
        lastName: 'Van Der Berg',
        cityId: cities[3]?._id?.toString(),
        roles: [UserRole.ADMIN],
        metadata: {
          department: 'Verkeer en Openbare Ruimte',
        },
      },
      {
        email: 'lars.planner@amsterdam.nl',
        password: 'password123',
        firstName: 'Lars',
        lastName: 'De Vries',
        cityId: cities[3]?._id?.toString(),
        roles: [UserRole.PLANNER],
        metadata: {
          specialization: 'Bicycle Infrastructure',
        },
      },
      // Copenhagen Users
      {
        email: 'anders.admin@copenhagen.dk',
        password: 'password123',
        firstName: 'Anders',
        lastName: 'Nielsen',
        cityId: cities[4]?._id?.toString(),
        roles: [UserRole.ADMIN, UserRole.PLANNER],
        metadata: {
          department: 'Teknik- og Miljøforvaltningen',
        },
      },
      {
        email: 'sophia.planner@copenhagen.dk',
        password: 'password123',
        firstName: 'Sophia',
        lastName: 'Hansen',
        cityId: cities[4]?._id?.toString(),
        roles: [UserRole.PLANNER],
        metadata: {
          specialization: 'Cycling Superhighways',
        },
      },
    ];

    const createdUsers: any[] = [];
    for (const userData of usersData) {
      try {
        const user = await this.usersService.create(userData);
        createdUsers.push(user);
      } catch (error) {
        this.logger.warn(`User ${userData.email} may already exist, skipping...`);
      }
    }

    return createdUsers;
  }

  private async seedNetworks(cities: any[]): Promise<any[]> {
    // Sample GeoJSON for bike lanes (simplified)
    const sampleBikeGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Main Street Bike Lane',
            type: 'protected',
            width: 2.5,
            surface: 'asphalt',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.0060, 40.7128],
              [-74.0050, 40.7138],
              [-74.0040, 40.7148],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Broadway Cycle Track',
            type: 'separated',
            width: 3.0,
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-73.9895, 40.7489],
              [-73.9885, 40.7499],
              [-73.9875, 40.7509],
            ],
          },
        },
      ],
    };

    // Sample GeoJSON for transit (simplified)
    const sampleTransitGeoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            route: 'Line 1',
            type: 'subway',
            frequency: 5,
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-74.0060, 40.7128],
              [-74.0000, 40.7200],
              [-73.9950, 40.7280],
            ],
          },
        },
      ],
    };

    const networksData = [
      // New York Networks
      {
        cityId: cities[0]?._id?.toString(),
        name: 'NYC Bike Lane Network 2024',
        type: NetworkType.BIKING,
        storageKey: 'networks/new-york/bike-lanes-2024.geojson',
        geojson: sampleBikeGeoJSON,
        metadata: {
          featureCount: 2,
          fileSize: JSON.stringify(sampleBikeGeoJSON).length,
          crs: 'EPSG:4326',
        },
        isBaseline: true,
      },
      {
        cityId: cities[0]?._id?.toString(),
        name: 'NYC Proposed Bike Expansion 2025',
        type: NetworkType.BIKING,
        storageKey: 'networks/new-york/bike-lanes-2025-proposed.geojson',
        geojson: sampleBikeGeoJSON,
        metadata: {
          featureCount: 2,
          fileSize: JSON.stringify(sampleBikeGeoJSON).length,
        },
        isBaseline: false,
      },
      {
        cityId: cities[0]?._id?.toString(),
        name: 'NYC Subway Network',
        type: NetworkType.TRANSIT,
        storageKey: 'networks/new-york/subway-2024.geojson',
        geojson: sampleTransitGeoJSON,
        metadata: {
          featureCount: 1,
          fileSize: JSON.stringify(sampleTransitGeoJSON).length,
        },
        isBaseline: true,
      },
      // Paris Networks
      {
        cityId: cities[1]?._id?.toString(),
        name: 'Paris Vélo Network',
        type: NetworkType.BIKING,
        storageKey: 'networks/paris/velo-2024.geojson',
        geojson: sampleBikeGeoJSON,
        metadata: {
          featureCount: 2,
          fileSize: JSON.stringify(sampleBikeGeoJSON).length,
        },
        isBaseline: true,
      },
      {
        cityId: cities[1]?._id?.toString(),
        name: 'Paris Metro Network',
        type: NetworkType.TRANSIT,
        storageKey: 'networks/paris/metro-2024.geojson',
        geojson: sampleTransitGeoJSON,
        metadata: {
          featureCount: 1,
          fileSize: JSON.stringify(sampleTransitGeoJSON).length,
        },
        isBaseline: true,
      },
      // Tokyo Networks
      {
        cityId: cities[2]?._id?.toString(),
        name: 'Tokyo Bike Lane System',
        type: NetworkType.BIKING,
        storageKey: 'networks/tokyo/bike-2024.geojson',
        geojson: sampleBikeGeoJSON,
        metadata: {
          featureCount: 2,
          fileSize: JSON.stringify(sampleBikeGeoJSON).length,
        },
        isBaseline: true,
      },
      {
        cityId: cities[2]?._id?.toString(),
        name: 'Tokyo Rail Network',
        type: NetworkType.TRANSIT,
        storageKey: 'networks/tokyo/rail-2024.geojson',
        geojson: sampleTransitGeoJSON,
        metadata: {
          featureCount: 1,
          fileSize: JSON.stringify(sampleTransitGeoJSON).length,
        },
        isBaseline: true,
      },
      // Amsterdam Networks
      {
        cityId: cities[3]?._id?.toString(),
        name: 'Amsterdam Fietsnetwerk',
        type: NetworkType.BIKING,
        storageKey: 'networks/amsterdam/fiets-2024.geojson',
        geojson: sampleBikeGeoJSON,
        metadata: {
          featureCount: 2,
          fileSize: JSON.stringify(sampleBikeGeoJSON).length,
        },
        isBaseline: true,
      },
      // Copenhagen Networks
      {
        cityId: cities[4]?._id?.toString(),
        name: 'Copenhagen Cycling Superhighways',
        type: NetworkType.BIKING,
        storageKey: 'networks/copenhagen/superhighways-2024.geojson',
        geojson: sampleBikeGeoJSON,
        metadata: {
          featureCount: 2,
          fileSize: JSON.stringify(sampleBikeGeoJSON).length,
        },
        isBaseline: true,
      },
    ];

    const createdNetworks: any[] = [];
    for (const networkData of networksData) {
      try {
        const network = await this.geojsonService.create(networkData);
        createdNetworks.push(network);
      } catch (error) {
        this.logger.warn(`Network ${networkData.name} may already exist, skipping...`);
      }
    }

    return createdNetworks;
  }
}
