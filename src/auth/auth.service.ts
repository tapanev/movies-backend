import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface loginResponse {
  data: {
    name: string;
    email: string;
    access_token: string;
    refresh_token: string;
  };
}

export interface refreshTokenResponse {
  data: {
    access_token: string;
    refreshToken: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any): Promise<loginResponse> {
    const payload = { user, sub: 1 };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      data: {
        name: user?.name || '-',
        email: user?.email || '-',
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<refreshTokenResponse> {
    try {
      const decodedToken = this.jwtService.verify(refreshToken);

      if (!decodedToken)
        throw new UnauthorizedException('Refresh token is not valid');

      const { user, sub } = decodedToken;

      const accessToken = this.jwtService.sign(
        { user, sub },
        { expiresIn: '1h' },
      );

      return {
        data: {
          access_token: accessToken,
          refreshToken: refreshToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
