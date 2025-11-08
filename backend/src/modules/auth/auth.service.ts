import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roles: string[];
      city: any;
    };
  }> {
    // Find user by email (returns user with password)
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.active) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    const userId = user._id ? user._id.toString() : user.id || '';
    await this.usersService.updateLastLogin(userId);

    // Generate JWT token
    const cityId = typeof user.city === 'object' && 'id' in user.city
      ? (user.city as any).id
      : (user.city as any).toString();

    const payload: JwtPayload = {
      sub: userId,
      email: user.email,
      roles: user.roles,
      cityId,
    };

    const access_token = this.jwtService.sign(payload);

    // Return token and user info (without password)
    return {
      access_token,
      user: {
        id: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        city: user.city,
      },
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.active) {
      return null;
    }
    return user;
  }
}
