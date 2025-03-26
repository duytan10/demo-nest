import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  async getProfile(@Request() req): Promise<User | null> {
    const userReq = req.user;
    const user = await this.usersService.findById(userReq.sub);
    return user;
  }
}
