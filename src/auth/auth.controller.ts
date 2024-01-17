import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(@Req() req) {
    const user = await this.authService.refreshToken(req.body.refresh_token);
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user.data);
  }
}
