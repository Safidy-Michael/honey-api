import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET || 'gkOiTfgBO3eXbousvOyr4yURMZmpAVkfN5mHC0YPRMw=',
    });
  }

  async validate(payload: any) {
  console.log('🔍 JWT Payload reçu:', payload);
  console.log('🔍 userId (sub):', payload.sub, 'type:', typeof payload.sub);
  console.log('🔍 email:', payload.email);
  
  return { 
    userId: payload.sub, 
    email: payload.email
  };
}
}
