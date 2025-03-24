import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // @UseGuards(AuthGuard('local'))
  // @Post('auth/login')
  // login(@Req() req: Request) {
  //   console.log('req: ', req);
  //   return true;
  // }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
