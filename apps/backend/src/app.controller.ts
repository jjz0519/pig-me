import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {AppService} from './app.service';
import {AuthGuard} from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  // --- Add this new protected route ---
  @UseGuards(AuthGuard('jwt')) // Apply the guard, 'jwt' is the default name for our JwtStrategy
  @Get('profile')
  getProfile(@Req() req) {
    // Because of our `validate` method in JwtStrategy, `req.user` now contains the user object.
    return req.user;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
