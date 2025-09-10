import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string,) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      name,
      email,
      password: hashedPassword
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.finByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
  const user = await this.usersService.finByEmail(email);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

  const payload = { sub: user.id, email: user.email, role: user.role };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

  async profile(userId: number) {
    return this.usersService.findOne(userId);
  }
}